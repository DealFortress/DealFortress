import { ChangeType } from './entity-collection';
import { defaultSelectId } from '../utils/utilities';
import { MergeStrategy } from '../actions/merge-strategy';
/**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 */
export class EntityChangeTrackerBase {
    constructor(adapter, selectId) {
        this.adapter = adapter;
        this.selectId = selectId;
        /** Extract the primary key (id); default to `id` */
        this.selectId = selectId || defaultSelectId;
    }
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param collection The entity collection
     */
    commitAll(collection) {
        return Object.keys(collection.changeState).length === 0
            ? collection
            : { ...collection, changeState: {} };
    }
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param entityOrIdList The entities to clear tracking or their ids.
     * @param collection The entity collection
     */
    commitMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        let didMutate = false;
        const changeState = entityOrIdList.reduce((chgState, entityOrId) => {
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : entityOrId;
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = { ...chgState };
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    commitOne(entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.commitMany([entityOrId], collection);
    }
    // #endregion commit methods
    // #region merge query
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param entities Entities returned from querying the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.PreserveChanges.
     * @returns The merged EntityCollection.
     */
    mergeQueryResults(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
    }
    // #endregion merge query results
    // #region merge save results
    /**
     * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving new entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveAdds(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param entities keys primary keys of the entities to remove/delete.
     * @param collection The entity collection
     * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveDeletes(keys, collection, mergeStrategy) {
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        const deleteIds = keys; // make TypeScript happy
        collection =
            mergeStrategy === MergeStrategy.IgnoreChanges
                ? collection
                : this.commitMany(deleteIds, collection);
        return this.adapter.removeMany(deleteIds, collection);
    }
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param updateResponseData Entity response data returned from saving updated entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
     * If the update was optimistic and the server didn't make more changes of its own
     * then the updates are already in the collection and shouldn't make them again.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpdates(updateResponseData, collection, mergeStrategy, skipUnchanged = false) {
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }
        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        let updates;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.OverwriteChanges:
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? { ...collection, changeState } : collection;
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.PreserveChanges: {
                const updateableEntities = [];
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        const newId = this.selectId(update.changes);
                        const oldChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        const newOrigValue = {
                            ...oldChangeState.originalValue,
                            ...update.changes,
                        };
                        chgState[newId] = {
                            ...oldChangeState,
                            originalValue: newOrigValue,
                        };
                    }
                    else {
                        updateableEntities.push(update);
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? { ...collection, changeState } : collection;
                updates = filterChanged(updateableEntities);
                return this.adapter.updateMany(updates, collection);
            }
        }
        /**
         * Conditionally keep only those updates that have additional server changes.
         * (e.g., for optimistic saves because they updates are already in the current collection)
         * Strip off the `changed` property.
         * @responseData Entity response data from server.
         * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
         * @returns Update<T> (without the changed flag)
         */
        function filterChanged(responseData) {
            if (skipUnchanged === true) {
                // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                responseData = responseData.filter((r) => r.changed === true);
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map((r) => ({ id: r.id, changes: r.changes }));
        }
    }
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving upserts to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpserts(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    // #endregion merge save results
    // #region query & save helpers
    /**
     *
     * @param entities Entities to merge
     * @param collection Collection into which entities are merged
     * @param defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
     * @param [mergeStrategy] The action's MergeStrategy
     */
    mergeServerUpserts(entities, collection, defaultMergeStrategy, mergeStrategy) {
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }
        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                return this.adapter.upsertMany(entities, collection);
            case MergeStrategy.OverwriteChanges:
                collection = this.adapter.upsertMany(entities, collection);
                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }, collection.changeState);
                return didMutate ? { ...collection, changeState } : collection;
            case MergeStrategy.PreserveChanges: {
                const upsertEntities = [];
                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = {
                                ...chgState,
                                [id]: {
                                    ...chgState[id],
                                    originalValue: entity,
                                },
                            };
                            didMutate = true;
                        }
                    }
                    else {
                        upsertEntities.push(entity);
                    }
                    return chgState;
                }, collection.changeState);
                collection = this.adapter.upsertMany(upsertEntities, collection);
                return didMutate ? { ...collection, changeState } : collection;
            }
        }
    }
    // #endregion query & save helpers
    // #region track methods
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entities The entities to add. They must all have their ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackAddMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity add requires a key to be tracked`);
            }
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
                chgState[id] = { changeType: ChangeType.Added };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entity The entity to add. It must have an id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     * If not specified, implementation supplies a default strategy.
     */
    trackAddOne(entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackAddMany([entity], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param keys The primary keys of the entities to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackDeleteMany(keys, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = keys.reduce((chgState, id) => {
            const originalValue = entityMap[id];
            if (originalValue) {
                const trackedChange = chgState[id];
                if (trackedChange) {
                    if (trackedChange.changeType === ChangeType.Added) {
                        // Special case: stop tracking an added entity that you delete
                        // The caller must also detect this, remove it immediately from the collection
                        // and skip attempt to delete on the server.
                        cloneChgStateOnce();
                        delete chgState[id];
                    }
                    else if (trackedChange.changeType === ChangeType.Updated) {
                        // Special case: switch change type from Updated to Deleted.
                        cloneChgStateOnce();
                        chgState[id] = { ...chgState[id], changeType: ChangeType.Deleted };
                    }
                }
                else {
                    // Start tracking this entity
                    cloneChgStateOnce();
                    chgState[id] = { changeType: ChangeType.Deleted, originalValue };
                }
            }
            return chgState;
            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
            }
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param key The primary key of the entity to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackDeleteOne(key, collection, mergeStrategy) {
        return key == null
            ? collection
            : this.trackDeleteMany([key], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param updates The entities to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpdateMany(updates, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = updates.reduce((chgState, update) => {
            const { id, changes: entity } = update;
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity update requires a key to be tracked`);
            }
            const originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = { ...chgState };
                    }
                    chgState[id] = { changeType: ChangeType.Updated, originalValue };
                }
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param update The entity to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpdateOne(update, collection, mergeStrategy) {
        return update == null
            ? collection
            : this.trackUpdateMany([update], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entities to add or update. They must be complete entities with ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpsertMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity upsert requires a key to be tracked`);
            }
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
                const originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: ChangeType.Added }
                        : { changeType: ChangeType.Updated, originalValue };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entity to add or update. It must be a complete entity with its id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpsertOne(entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackUpsertMany([entity], collection, mergeStrategy);
    }
    // #endregion track methods
    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param collection The entity collection
     */
    undoAll(collection) {
        const ids = Object.keys(collection.changeState);
        const { remove, upsert } = ids.reduce((acc, id) => {
            const changeState = acc.chgState[id];
            switch (changeState.changeType) {
                case ChangeType.Added:
                    acc.remove.push(id);
                    break;
                case ChangeType.Deleted:
                    const removed = changeState.originalValue;
                    if (removed) {
                        acc.upsert.push(removed);
                    }
                    break;
                case ChangeType.Updated:
                    acc.upsert.push(changeState.originalValue);
                    break;
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            chgState: collection.changeState,
        });
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return { ...collection, changeState: {} };
    }
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    undoMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        let didMutate = false;
        const { changeState, remove, upsert } = entityOrIdList.reduce((acc, entityOrId) => {
            let chgState = acc.changeState;
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : entityOrId;
            const change = chgState[id];
            if (change) {
                if (!didMutate) {
                    chgState = { ...chgState };
                    didMutate = true;
                }
                delete chgState[id]; // clear tracking of this entity
                acc.changeState = chgState;
                switch (change.changeType) {
                    case ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case ChangeType.Deleted:
                        const removed = change.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case ChangeType.Updated:
                        acc.upsert.push(change.originalValue);
                        break;
                }
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            changeState: collection.changeState,
        });
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    undoOne(entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNoYW5nZS10cmFja2VyLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jaGFuZ2UtdHJhY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQW9CLE1BQU0scUJBQXFCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUcxRDs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFDVSxPQUF5QixFQUN6QixRQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUN6QixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBRS9CLG9EQUFvRDtRQUNwRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxlQUFlLENBQUM7SUFDOUMsQ0FBQztJQUVELHlCQUF5QjtJQUN6Qjs7OztPQUlHO0lBQ0gsU0FBUyxDQUFDLFVBQStCO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDckQsQ0FBQyxDQUFDLFVBQVU7WUFDWixDQUFDLENBQUMsRUFBRSxHQUFHLFVBQVUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUNSLGNBQXVDLEVBQ3ZDLFVBQStCO1FBRS9CLElBQUksY0FBYyxJQUFJLElBQUksSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6RCxPQUFPLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQjtTQUN4QztRQUNELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixNQUFNLFdBQVcs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QUcsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTyxDQUNMLFVBQStCLEVBQy9CLFVBQStCO1FBRS9CLE9BQU8sVUFBVSxJQUFJLElBQUk7WUFDdkIsQ0FBQyxDQUFDLFVBQVU7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eUFkYXB0ZXIsIElkU2VsZWN0b3IsIFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IENoYW5nZVR5cGUsIEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IGRlZmF1bHRTZWxlY3RJZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBFbnRpdHlDaGFuZ2VUcmFja2VyIH0gZnJvbSAnLi9lbnRpdHktY2hhbmdlLXRyYWNrZXInO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgRW50aXR5Q2hhbmdlVHJhY2tlciB3aXRoXG4gKiBtZXRob2RzIGZvciB0cmFja2luZywgY29tbWl0dGluZywgYW5kIHJldmVydGluZy91bmRvaW5nIHVuc2F2ZWQgZW50aXR5IGNoYW5nZXMuXG4gKiBVc2VkIGJ5IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kcyB3aGljaCBzaG91bGQgY2FsbCB0cmFja2VyIG1ldGhvZHMgQkVGT1JFIG1vZGlmeWluZyB0aGUgY29sbGVjdGlvbi5cbiAqIFNlZSBFbnRpdHlDaGFuZ2VUcmFja2VyIGRvY3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlDaGFuZ2VUcmFja2VyQmFzZTxUPiBpbXBsZW1lbnRzIEVudGl0eUNoYW5nZVRyYWNrZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFkYXB0ZXI6IEVudGl0eUFkYXB0ZXI8VD4sXG4gICAgcHJpdmF0ZSBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPlxuICApIHtcbiAgICAvKiogRXh0cmFjdCB0aGUgcHJpbWFyeSBrZXkgKGlkKTsgZGVmYXVsdCB0byBgaWRgICovXG4gICAgdGhpcy5zZWxlY3RJZCA9IHNlbGVjdElkIHx8IGRlZmF1bHRTZWxlY3RJZDtcbiAgfVxuXG4gIC8vICNyZWdpb24gY29tbWl0IG1ldGhvZHNcbiAgLyoqXG4gICAqIENvbW1pdCBhbGwgY2hhbmdlcyBhcyB3aGVuIHRoZSBjb2xsZWN0aW9uIGhhcyBiZWVuIGNvbXBsZXRlbHkgcmVsb2FkZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byBjb21taXQuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgY29tbWl0QWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSkubGVuZ3RoID09PSAwXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogeyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZToge30gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21taXQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0aWVzIGFzIHdoZW4gdGhleSBoYXZlIGJlZW4gcmVmcmVzaGVkIGZyb20gdGhlIHNlcnZlci5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gY29tbWl0LlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZExpc3QgVGhlIGVudGl0aWVzIHRvIGNsZWFyIHRyYWNraW5nIG9yIHRoZWlyIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRNYW55KFxuICAgIGVudGl0eU9ySWRMaXN0OiAobnVtYmVyIHwgc3RyaW5nIHwgVClbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChlbnRpdHlPcklkTGlzdCA9PSBudWxsIHx8IGVudGl0eU9ySWRMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gY29tbWl0XG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0eU9ySWRMaXN0LnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eU9ySWQpID0+IHtcbiAgICAgIGNvbnN0IGlkID1cbiAgICAgICAgdHlwZW9mIGVudGl0eU9ySWQgPT09ICdvYmplY3QnXG4gICAgICAgICAgPyB0aGlzLnNlbGVjdElkKGVudGl0eU9ySWQpXG4gICAgICAgICAgOiAoZW50aXR5T3JJZCBhcyBzdHJpbmcgfCBudW1iZXIpO1xuICAgICAgaWYgKGNoZ1N0YXRlW2lkXSkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNoZ1N0YXRlW2lkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1pdCBjaGFuZ2VzIGZvciB0aGUgZ2l2ZW4gZW50aXR5IGFzIHdoZW4gaXQgaGF2ZSBiZWVuIHJlZnJlc2hlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEhhcm1sZXNzIHdoZW4gbm8gZW50aXR5IGNoYW5nZXMgdG8gY29tbWl0LlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZCBUaGUgZW50aXR5IHRvIGNsZWFyIHRyYWNraW5nIG9yIGl0cyBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICBjb21taXRPbmUoXG4gICAgZW50aXR5T3JJZDogbnVtYmVyIHwgc3RyaW5nIHwgVCxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiBlbnRpdHlPcklkID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLmNvbW1pdE1hbnkoW2VudGl0eU9ySWRdLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gY29tbWl0IG1ldGhvZHNcblxuICAvLyAjcmVnaW9uIG1lcmdlIHF1ZXJ5XG4gIC8qKlxuICAgKiBNZXJnZSBxdWVyeSByZXN1bHRzIGludG8gdGhlIGNvbGxlY3Rpb24sIGFkanVzdGluZyB0aGUgQ2hhbmdlU3RhdGUgcGVyIHRoZSBtZXJnZVN0cmF0ZWd5LlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBxdWVyeWluZyB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzLlxuICAgKiBAcmV0dXJucyBUaGUgbWVyZ2VkIEVudGl0eUNvbGxlY3Rpb24uXG4gICAqL1xuICBtZXJnZVF1ZXJ5UmVzdWx0cyhcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgICAgZW50aXRpZXMsXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgTWVyZ2VTdHJhdGVneS5QcmVzZXJ2ZUNoYW5nZXMsXG4gICAgICBtZXJnZVN0cmF0ZWd5XG4gICAgKTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIG1lcmdlIHF1ZXJ5IHJlc3VsdHNcblxuICAvLyAjcmVnaW9uIG1lcmdlIHNhdmUgcmVzdWx0c1xuICAvKipcbiAgICogTWVyZ2UgcmVzdWx0IG9mIHNhdmluZyBuZXcgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHJldHVybmVkIGZyb20gc2F2aW5nIG5ldyBlbnRpdGllcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBzYXZlZCBlbnRpdHkgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZUFkZHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLm1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIHN1Y2Nlc3NmdWwgcmVzdWx0IG9mIGRlbGV0aW5nIGVudGl0aWVzIG9uIHRoZSBzZXJ2ZXIgdGhhdCBoYXZlIHRoZSBnaXZlbiBwcmltYXJ5IGtleXNcbiAgICogQ2xlYXJzIHRoZSBlbnRpdHkgY2hhbmdlU3RhdGUgZm9yIHRob3NlIGtleXMgdW5sZXNzIHRoZSBNZXJnZVN0cmF0ZWd5IGlzIGlnbm9yZUNoYW5nZXMuXG4gICAqIEBwYXJhbSBlbnRpdGllcyBrZXlzIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gcmVtb3ZlL2RlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gSG93IHRvIGFkanVzdCBjaGFuZ2UgdHJhY2tpbmcgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZURlbGV0ZXMoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PSBudWxsID8gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICAvLyBzYW1lIGxvZ2ljIGZvciBhbGwgbm9uLWlnbm9yZSBtZXJnZSBzdHJhdGVnaWVzOiBhbHdheXMgY2xlYXIgKGNvbW1pdCkgdGhlIGNoYW5nZXNcbiAgICBjb25zdCBkZWxldGVJZHMgPSBrZXlzIGFzIHN0cmluZ1tdOyAvLyBtYWtlIFR5cGVTY3JpcHQgaGFwcHlcbiAgICBjb2xsZWN0aW9uID1cbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlc1xuICAgICAgICA/IGNvbGxlY3Rpb25cbiAgICAgICAgOiB0aGlzLmNvbW1pdE1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnJlbW92ZU1hbnkoZGVsZXRlSWRzLCBjb2xsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZSByZXN1bHQgb2Ygc2F2aW5nIHVwZGF0ZWQgZW50aXRpZXMgaW50byB0aGUgY29sbGVjdGlvbiwgYWRqdXN0aW5nIHRoZSBDaGFuZ2VTdGF0ZSBwZXIgdGhlIG1lcmdlU3RyYXRlZ3kuXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIHVwZGF0ZVJlc3BvbnNlRGF0YSBFbnRpdHkgcmVzcG9uc2UgZGF0YSByZXR1cm5lZCBmcm9tIHNhdmluZyB1cGRhdGVkIGVudGl0aWVzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIEhvdyB0byBtZXJnZSBhIHNhdmVkIGVudGl0eSB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIGVudGl0eSBpbiB0aGUgY29sbGVjdGlvbiBoYXMgYW4gdW5zYXZlZCBjaGFuZ2UuXG4gICAqIERlZmF1bHRzIHRvIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcy5cbiAgICogQHBhcmFtIFtza2lwVW5jaGFuZ2VkXSBUcnVlIG1lYW5zIHNraXAgdXBkYXRlIGlmIHNlcnZlciBkaWRuJ3QgY2hhbmdlIGl0LiBGYWxzZSBieSBkZWZhdWx0LlxuICAgKiBJZiB0aGUgdXBkYXRlIHdhcyBvcHRpbWlzdGljIGFuZCB0aGUgc2VydmVyIGRpZG4ndCBtYWtlIG1vcmUgY2hhbmdlcyBvZiBpdHMgb3duXG4gICAqIHRoZW4gdGhlIHVwZGF0ZXMgYXJlIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24gYW5kIHNob3VsZG4ndCBtYWtlIHRoZW0gYWdhaW4uXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZVVwZGF0ZXMoXG4gICAgdXBkYXRlUmVzcG9uc2VEYXRhOiBVcGRhdGVSZXNwb25zZURhdGE8VD5bXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5LFxuICAgIHNraXBVbmNoYW5nZWQgPSBmYWxzZVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAodXBkYXRlUmVzcG9uc2VEYXRhID09IG51bGwgfHwgdXBkYXRlUmVzcG9uc2VEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gbWVyZ2UuXG4gICAgfVxuXG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGxldCBjaGFuZ2VTdGF0ZSA9IGNvbGxlY3Rpb24uY2hhbmdlU3RhdGU7XG4gICAgbWVyZ2VTdHJhdGVneSA9XG4gICAgICBtZXJnZVN0cmF0ZWd5ID09IG51bGwgPyBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMgOiBtZXJnZVN0cmF0ZWd5O1xuICAgIGxldCB1cGRhdGVzOiBVcGRhdGU8VD5bXTtcblxuICAgIHN3aXRjaCAobWVyZ2VTdHJhdGVneSkge1xuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXM6XG4gICAgICAgIHVwZGF0ZXMgPSBmaWx0ZXJDaGFuZ2VkKHVwZGF0ZVJlc3BvbnNlRGF0YSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIudXBkYXRlTWFueSh1cGRhdGVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXM6XG4gICAgICAgIGNoYW5nZVN0YXRlID0gdXBkYXRlUmVzcG9uc2VEYXRhLnJlZHVjZSgoY2hnU3RhdGUsIHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9sZElkID0gdXBkYXRlLmlkO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW29sZElkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICAgICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdXBkYXRlcyA9IGZpbHRlckNoYW5nZWQodXBkYXRlUmVzcG9uc2VEYXRhKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cGRhdGVNYW55KHVwZGF0ZXMsIGNvbGxlY3Rpb24pO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzOiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWFibGVFbnRpdGllcyA9IFtdIGFzIFVwZGF0ZVJlc3BvbnNlRGF0YTxUPltdO1xuICAgICAgICBjaGFuZ2VTdGF0ZSA9IHVwZGF0ZVJlc3BvbnNlRGF0YS5yZWR1Y2UoKGNoZ1N0YXRlLCB1cGRhdGUpID0+IHtcbiAgICAgICAgICBjb25zdCBvbGRJZCA9IHVwZGF0ZS5pZDtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgLy8gVHJhY2tpbmcgYSBjaGFuZ2Ugc28gdXBkYXRlIG9yaWdpbmFsIHZhbHVlIGJ1dCBub3QgdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV3SWQgPSB0aGlzLnNlbGVjdElkKHVwZGF0ZS5jaGFuZ2VzIGFzIFQpO1xuICAgICAgICAgICAgY29uc3Qgb2xkQ2hhbmdlU3RhdGUgPSBjaGFuZ2U7XG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VydmVyIGNoYW5nZWQgdGhlIGlkLCByZWdpc3RlciB0aGUgbmV3IFwib3JpZ2luYWxWYWx1ZVwiIHVuZGVyIHRoZSBuZXcgaWRcbiAgICAgICAgICAgIC8vIGFuZCByZW1vdmUgdGhlIGNoYW5nZSB0cmFja2VkIHVuZGVyIHRoZSBvbGQgaWQuXG4gICAgICAgICAgICBpZiAobmV3SWQgIT09IG9sZElkKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBjaGdTdGF0ZVtvbGRJZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdPcmlnVmFsdWUgPSB7XG4gICAgICAgICAgICAgIC4uLihvbGRDaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZSBhcyBhbnkpLFxuICAgICAgICAgICAgICAuLi4odXBkYXRlLmNoYW5nZXMgYXMgYW55KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAoY2hnU3RhdGUgYXMgYW55KVtuZXdJZF0gPSB7XG4gICAgICAgICAgICAgIC4uLm9sZENoYW5nZVN0YXRlLFxuICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBuZXdPcmlnVmFsdWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cGRhdGVhYmxlRW50aXRpZXMucHVzaCh1cGRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuICAgICAgICBjb2xsZWN0aW9uID0gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcblxuICAgICAgICB1cGRhdGVzID0gZmlsdGVyQ2hhbmdlZCh1cGRhdGVhYmxlRW50aXRpZXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnVwZGF0ZU1hbnkodXBkYXRlcywgY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZGl0aW9uYWxseSBrZWVwIG9ubHkgdGhvc2UgdXBkYXRlcyB0aGF0IGhhdmUgYWRkaXRpb25hbCBzZXJ2ZXIgY2hhbmdlcy5cbiAgICAgKiAoZS5nLiwgZm9yIG9wdGltaXN0aWMgc2F2ZXMgYmVjYXVzZSB0aGV5IHVwZGF0ZXMgYXJlIGFscmVhZHkgaW4gdGhlIGN1cnJlbnQgY29sbGVjdGlvbilcbiAgICAgKiBTdHJpcCBvZmYgdGhlIGBjaGFuZ2VkYCBwcm9wZXJ0eS5cbiAgICAgKiBAcmVzcG9uc2VEYXRhIEVudGl0eSByZXNwb25zZSBkYXRhIGZyb20gc2VydmVyLlxuICAgICAqIE1heSBiZSBhbiBVcGRhdGVSZXNwb25zZURhdGE8VD4sIGEgc3ViY2xhc3Mgb2YgVXBkYXRlPFQ+IHdpdGggYSAnY2hhbmdlZCcgZmxhZy5cbiAgICAgKiBAcmV0dXJucyBVcGRhdGU8VD4gKHdpdGhvdXQgdGhlIGNoYW5nZWQgZmxhZylcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJDaGFuZ2VkKHJlc3BvbnNlRGF0YTogVXBkYXRlUmVzcG9uc2VEYXRhPFQ+W10pOiBVcGRhdGU8VD5bXSB7XG4gICAgICBpZiAoc2tpcFVuY2hhbmdlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBrZWVwIG9ubHkgdGhvc2UgdXBkYXRlcyB0aGF0IHRoZSBzZXJ2ZXIgY2hhbmdlZCAoa25vd2FibGUgaWYgaXMgVXBkYXRlUmVzcG9uc2VEYXRhPFQ+KVxuICAgICAgICByZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEuZmlsdGVyKChyKSA9PiByLmNoYW5nZWQgPT09IHRydWUpO1xuICAgICAgfVxuICAgICAgLy8gU3RyaXAgdW5jaGFuZ2VkIHByb3BlcnR5IGZyb20gcmVzcG9uc2VEYXRhLCBsZWF2aW5nIGp1c3QgdGhlIHB1cmUgVXBkYXRlPFQ+XG4gICAgICAvLyBUT0RPOiBSZW1vdmU/IHByb2JhYmx5IG5vdCBuZWNlc3NhcnkgYXMgdGhlIFVwZGF0ZSBpc24ndCBzdG9yZWQgYW5kIGFkYXB0ZXIgd2lsbCBpZ25vcmUgYGNoYW5nZWRgLlxuICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YS5tYXAoKHIpID0+ICh7IGlkOiByLmlkIGFzIGFueSwgY2hhbmdlczogci5jaGFuZ2VzIH0pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2UgcmVzdWx0IG9mIHNhdmluZyB1cHNlcnRlZCBlbnRpdGllcyBpbnRvIHRoZSBjb2xsZWN0aW9uLCBhZGp1c3RpbmcgdGhlIENoYW5nZVN0YXRlIHBlciB0aGUgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlIGRlZmF1bHQgaXMgTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGVDaGFuZ2VzLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgRW50aXRpZXMgcmV0dXJuZWQgZnJvbSBzYXZpbmcgdXBzZXJ0cyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBIb3cgdG8gbWVyZ2UgYSBzYXZlZCBlbnRpdHkgd2hlbiB0aGUgY29ycmVzcG9uZGluZyBlbnRpdHkgaW4gdGhlIGNvbGxlY3Rpb24gaGFzIGFuIHVuc2F2ZWQgY2hhbmdlLlxuICAgKiBEZWZhdWx0cyB0byBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXMuXG4gICAqIEByZXR1cm5zIFRoZSBtZXJnZWQgRW50aXR5Q29sbGVjdGlvbi5cbiAgICovXG4gIG1lcmdlU2F2ZVVwc2VydHMoXG4gICAgZW50aXRpZXM6IFRbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIHJldHVybiB0aGlzLm1lcmdlU2VydmVyVXBzZXJ0cyhcbiAgICAgIGVudGl0aWVzLFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIE1lcmdlU3RyYXRlZ3kuT3ZlcndyaXRlQ2hhbmdlcyxcbiAgICAgIG1lcmdlU3RyYXRlZ3lcbiAgICApO1xuICB9XG4gIC8vICNlbmRyZWdpb24gbWVyZ2Ugc2F2ZSByZXN1bHRzXG5cbiAgLy8gI3JlZ2lvbiBxdWVyeSAmIHNhdmUgaGVscGVyc1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGVudGl0aWVzIEVudGl0aWVzIHRvIG1lcmdlXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIENvbGxlY3Rpb24gaW50byB3aGljaCBlbnRpdGllcyBhcmUgbWVyZ2VkXG4gICAqIEBwYXJhbSBkZWZhdWx0TWVyZ2VTdHJhdGVneSBIb3cgdG8gbWVyZ2Ugd2hlbiBhY3Rpb24ncyBNZXJnZVN0cmF0ZWd5IGlzIHVuc3BlY2lmaWVkXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVGhlIGFjdGlvbidzIE1lcmdlU3RyYXRlZ3lcbiAgICovXG4gIHByaXZhdGUgbWVyZ2VTZXJ2ZXJVcHNlcnRzKFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBkZWZhdWx0TWVyZ2VTdHJhdGVneTogTWVyZ2VTdHJhdGVneSxcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoZW50aXRpZXMgPT0gbnVsbCB8fCBlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIG1lcmdlLlxuICAgIH1cblxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBsZXQgY2hhbmdlU3RhdGUgPSBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PSBudWxsID8gZGVmYXVsdE1lcmdlU3RyYXRlZ3kgOiBtZXJnZVN0cmF0ZWd5O1xuXG4gICAgc3dpdGNoIChtZXJnZVN0cmF0ZWd5KSB7XG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlczpcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci51cHNlcnRNYW55KGVudGl0aWVzLCBjb2xsZWN0aW9uKTtcblxuICAgICAgY2FzZSBNZXJnZVN0cmF0ZWd5Lk92ZXJ3cml0ZUNoYW5nZXM6XG4gICAgICAgIGNvbGxlY3Rpb24gPSB0aGlzLmFkYXB0ZXIudXBzZXJ0TWFueShlbnRpdGllcywgY29sbGVjdGlvbik7XG5cbiAgICAgICAgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuc2VsZWN0SWQoZW50aXR5KTtcbiAgICAgICAgICBjb25zdCBjaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgaWYgKCFkaWRNdXRhdGUpIHtcbiAgICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgICAgIHJldHVybiBkaWRNdXRhdGUgPyB7IC4uLmNvbGxlY3Rpb24sIGNoYW5nZVN0YXRlIH0gOiBjb2xsZWN0aW9uO1xuXG4gICAgICBjYXNlIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzOiB7XG4gICAgICAgIGNvbnN0IHVwc2VydEVudGl0aWVzID0gW10gYXMgVFtdO1xuICAgICAgICBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcbiAgICAgICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgICBjaGdTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAuLi5jaGdTdGF0ZSxcbiAgICAgICAgICAgICAgICBbaWRdOiB7XG4gICAgICAgICAgICAgICAgICAuLi5jaGdTdGF0ZVtpZF0hLFxuICAgICAgICAgICAgICAgICAgb3JpZ2luYWxWYWx1ZTogZW50aXR5LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwc2VydEVudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoZ1N0YXRlO1xuICAgICAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgICAgICBjb2xsZWN0aW9uID0gdGhpcy5hZGFwdGVyLnVwc2VydE1hbnkodXBzZXJ0RW50aXRpZXMsIGNvbGxlY3Rpb24pO1xuICAgICAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBxdWVyeSAmIHNhdmUgaGVscGVyc1xuXG4gIC8vICNyZWdpb24gdHJhY2sgbWV0aG9kc1xuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIGFkZGluZyB0aGVtIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKiBEb2VzIE5PVCBhZGQgdG8gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGVudGl0aWVzIFRoZSBlbnRpdGllcyB0byBhZGQuIFRoZXkgbXVzdCBhbGwgaGF2ZSB0aGVpciBpZHMuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrQWRkTWFueShcbiAgICBlbnRpdGllczogVFtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKFxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzIHx8XG4gICAgICBlbnRpdGllcyA9PSBudWxsIHx8XG4gICAgICBlbnRpdGllcy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGVudGl0aWVzLnJlZHVjZSgoY2hnU3RhdGUsIGVudGl0eSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnNlbGVjdElkKGVudGl0eSk7XG4gICAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZCA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke2NvbGxlY3Rpb24uZW50aXR5TmFtZX0gZW50aXR5IGFkZCByZXF1aXJlcyBhIGtleSB0byBiZSB0cmFja2VkYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhY2tlZENoYW5nZSA9IGNoZ1N0YXRlW2lkXTtcblxuICAgICAgaWYgKCF0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgfVxuICAgICAgICBjaGdTdGF0ZVtpZF0gPSB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuQWRkZWQgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIGFkZGluZyBpdCB0byB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgYWRkIHRvIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSBlbnRpdHkgVGhlIGVudGl0eSB0byBhZGQuIEl0IG11c3QgaGF2ZSBhbiBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCBpbXBsZW1lbnRhdGlvbiBzdXBwbGllcyBhIGRlZmF1bHQgc3RyYXRlZ3kuXG4gICAqL1xuICB0cmFja0FkZE9uZShcbiAgICBlbnRpdHk6IFQsXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gZW50aXR5ID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrQWRkTWFueShbZW50aXR5XSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIHJlbW92aW5nIHRoZW0gd2l0aCB0aGUgaW50ZW50aW9uIG9mIGRlbGV0aW5nIHRoZW0gb24gdGhlIHNlcnZlci5cbiAgICogRG9lcyBOT1QgcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb24gKHRoZSByZWR1Y2VyJ3Mgam9iKS5cbiAgICogQHBhcmFtIGtleXMgVGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXRpZXMgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja0RlbGV0ZU1hbnkoXG4gICAga2V5czogKG51bWJlciB8IHN0cmluZylbXSxcbiAgICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5XG4gICk6IEVudGl0eUNvbGxlY3Rpb248VD4ge1xuICAgIGlmIChcbiAgICAgIG1lcmdlU3RyYXRlZ3kgPT09IE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcyB8fFxuICAgICAga2V5cyA9PSBudWxsIHx8XG4gICAgICBrZXlzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGVudGl0eU1hcCA9IGNvbGxlY3Rpb24uZW50aXRpZXM7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSBrZXlzLnJlZHVjZSgoY2hnU3RhdGUsIGlkKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gZW50aXR5TWFwW2lkXTtcbiAgICAgIGlmIChvcmlnaW5hbFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG4gICAgICAgIGlmICh0cmFja2VkQ2hhbmdlKSB7XG4gICAgICAgICAgaWYgKHRyYWNrZWRDaGFuZ2UuY2hhbmdlVHlwZSA9PT0gQ2hhbmdlVHlwZS5BZGRlZCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlOiBzdG9wIHRyYWNraW5nIGFuIGFkZGVkIGVudGl0eSB0aGF0IHlvdSBkZWxldGVcbiAgICAgICAgICAgIC8vIFRoZSBjYWxsZXIgbXVzdCBhbHNvIGRldGVjdCB0aGlzLCByZW1vdmUgaXQgaW1tZWRpYXRlbHkgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAgICAgICAgLy8gYW5kIHNraXAgYXR0ZW1wdCB0byBkZWxldGUgb24gdGhlIHNlcnZlci5cbiAgICAgICAgICAgIGNsb25lQ2hnU3RhdGVPbmNlKCk7XG4gICAgICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHJhY2tlZENoYW5nZS5jaGFuZ2VUeXBlID09PSBDaGFuZ2VUeXBlLlVwZGF0ZWQpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZTogc3dpdGNoIGNoYW5nZSB0eXBlIGZyb20gVXBkYXRlZCB0byBEZWxldGVkLlxuICAgICAgICAgICAgY2xvbmVDaGdTdGF0ZU9uY2UoKTtcbiAgICAgICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgLi4uY2hnU3RhdGVbaWRdLCBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkRlbGV0ZWQgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU3RhcnQgdHJhY2tpbmcgdGhpcyBlbnRpdHlcbiAgICAgICAgICBjbG9uZUNoZ1N0YXRlT25jZSgpO1xuICAgICAgICAgIGNoZ1N0YXRlW2lkXSA9IHsgY2hhbmdlVHlwZTogQ2hhbmdlVHlwZS5EZWxldGVkLCBvcmlnaW5hbFZhbHVlIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcblxuICAgICAgZnVuY3Rpb24gY2xvbmVDaGdTdGF0ZU9uY2UoKSB7XG4gICAgICAgIGlmICghZGlkTXV0YXRlKSB7XG4gICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICBjaGdTdGF0ZSA9IHsgLi4uY2hnU3RhdGUgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGNvbGxlY3Rpb24uY2hhbmdlU3RhdGUpO1xuXG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSBpdCBpcyByZW1vdmVkIHdpdGggdGhlIGludGVudGlvbiBvZiBkZWxldGluZyBpdCBvbiB0aGUgc2VydmVyLlxuICAgKiBEb2VzIE5PVCByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0ga2V5IFRoZSBwcmltYXJ5IGtleSBvZiB0aGUgZW50aXR5IHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tEZWxldGVPbmUoXG4gICAga2V5OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4ga2V5ID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrRGVsZXRlTWFueShba2V5XSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgbXVsdGlwbGUgZW50aXRpZXMgYmVmb3JlIHVwZGF0aW5nIHRoZW0gaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIHVwZGF0ZSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gdXBkYXRlcyBUaGUgZW50aXRpZXMgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1VwZGF0ZU1hbnkoXG4gICAgdXBkYXRlczogVXBkYXRlPFQ+W10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIHVwZGF0ZXMgPT0gbnVsbCB8fFxuICAgICAgdXBkYXRlcy5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uOyAvLyBub3RoaW5nIHRvIHRyYWNrXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcbiAgICBjb25zdCBlbnRpdHlNYXAgPSBjb2xsZWN0aW9uLmVudGl0aWVzO1xuICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gdXBkYXRlcy5yZWR1Y2UoKGNoZ1N0YXRlLCB1cGRhdGUpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQsIGNoYW5nZXM6IGVudGl0eSB9ID0gdXBkYXRlO1xuICAgICAgaWYgKGlkID09IG51bGwgfHwgaWQgPT09ICcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtjb2xsZWN0aW9uLmVudGl0eU5hbWV9IGVudGl0eSB1cGRhdGUgcmVxdWlyZXMgYSBrZXkgdG8gYmUgdHJhY2tlZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBlbnRpdHlNYXBbaWRdO1xuICAgICAgLy8gT25seSB0cmFjayBpZiBpdCBpcyBpbiB0aGUgY29sbGVjdGlvbi4gU2lsZW50bHkgaWdub3JlIGlmIGl0IGlzIG5vdC5cbiAgICAgIC8vIEBuZ3J4L2VudGl0eSBhZGFwdGVyIHdvdWxkIGFsc28gc2lsZW50bHkgaWdub3JlLlxuICAgICAgLy8gVG9kbzogc2hvdWxkIG1pc3NpbmcgdXBkYXRlIGVudGl0eSByZWFsbHkgYmUgcmVwb3J0ZWQgYXMgYW4gZXJyb3I/XG4gICAgICBpZiAob3JpZ2luYWxWYWx1ZSkge1xuICAgICAgICBjb25zdCB0cmFja2VkQ2hhbmdlID0gY2hnU3RhdGVbaWRdO1xuICAgICAgICBpZiAoIXRyYWNrZWRDaGFuZ2UpIHtcbiAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgZGlkTXV0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGNoZ1N0YXRlID0geyAuLi5jaGdTdGF0ZSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGdTdGF0ZVtpZF0gPSB7IGNoYW5nZVR5cGU6IENoYW5nZVR5cGUuVXBkYXRlZCwgb3JpZ2luYWxWYWx1ZSB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hnU3RhdGU7XG4gICAgfSwgY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSk7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYW4gZW50aXR5IGJlZm9yZSB1cGRhdGluZyBpdCBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICogRG9lcyBOT1QgdXBkYXRlIHRoZSBjb2xsZWN0aW9uICh0aGUgcmVkdWNlcidzIGpvYikuXG4gICAqIEBwYXJhbSB1cGRhdGUgVGhlIGVudGl0eSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gW21lcmdlU3RyYXRlZ3ldIFRyYWNrIGJ5IGRlZmF1bHQuIERvbid0IHRyYWNrIGlmIGlzIE1lcmdlU3RyYXRlZ3kuSWdub3JlQ2hhbmdlcy5cbiAgICovXG4gIHRyYWNrVXBkYXRlT25lKFxuICAgIHVwZGF0ZTogVXBkYXRlPFQ+LFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4sXG4gICAgbWVyZ2VTdHJhdGVneT86IE1lcmdlU3RyYXRlZ3lcbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgcmV0dXJuIHVwZGF0ZSA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy50cmFja1VwZGF0ZU1hbnkoW3VwZGF0ZV0sIGNvbGxlY3Rpb24sIG1lcmdlU3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIG11bHRpcGxlIGVudGl0aWVzIGJlZm9yZSB1cHNlcnRpbmcgKGFkZGluZyBhbmQgdXBkYXRpbmcpIHRoZW0gdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIHVwZGF0ZSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgVGhlIGVudGl0aWVzIHRvIGFkZCBvciB1cGRhdGUuIFRoZXkgbXVzdCBiZSBjb21wbGV0ZSBlbnRpdGllcyB3aXRoIGlkcy5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBbbWVyZ2VTdHJhdGVneV0gVHJhY2sgYnkgZGVmYXVsdC4gRG9uJ3QgdHJhY2sgaWYgaXMgTWVyZ2VTdHJhdGVneS5JZ25vcmVDaGFuZ2VzLlxuICAgKi9cbiAgdHJhY2tVcHNlcnRNYW55KFxuICAgIGVudGl0aWVzOiBUW10sXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBpZiAoXG4gICAgICBtZXJnZVN0cmF0ZWd5ID09PSBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMgfHxcbiAgICAgIGVudGl0aWVzID09IG51bGwgfHxcbiAgICAgIGVudGl0aWVzLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247IC8vIG5vdGhpbmcgdG8gdHJhY2tcbiAgICB9XG4gICAgbGV0IGRpZE11dGF0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGVudGl0eU1hcCA9IGNvbGxlY3Rpb24uZW50aXRpZXM7XG4gICAgY29uc3QgY2hhbmdlU3RhdGUgPSBlbnRpdGllcy5yZWR1Y2UoKGNoZ1N0YXRlLCBlbnRpdHkpID0+IHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5zZWxlY3RJZChlbnRpdHkpO1xuICAgICAgaWYgKGlkID09IG51bGwgfHwgaWQgPT09ICcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtjb2xsZWN0aW9uLmVudGl0eU5hbWV9IGVudGl0eSB1cHNlcnQgcmVxdWlyZXMgYSBrZXkgdG8gYmUgdHJhY2tlZGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRyYWNrZWRDaGFuZ2UgPSBjaGdTdGF0ZVtpZF07XG5cbiAgICAgIGlmICghdHJhY2tlZENoYW5nZSkge1xuICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgIGRpZE11dGF0ZSA9IHRydWU7XG4gICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gZW50aXR5TWFwW2lkXTtcbiAgICAgICAgY2hnU3RhdGVbaWRdID1cbiAgICAgICAgICBvcmlnaW5hbFZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8geyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLkFkZGVkIH1cbiAgICAgICAgICAgIDogeyBjaGFuZ2VUeXBlOiBDaGFuZ2VUeXBlLlVwZGF0ZWQsIG9yaWdpbmFsVmFsdWUgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGdTdGF0ZTtcbiAgICB9LCBjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcbiAgICByZXR1cm4gZGlkTXV0YXRlID8geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZSB9IDogY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhbiBlbnRpdHkgYmVmb3JlIHVwc2VydCAoYWRkaW5nIGFuZCB1cGRhdGluZykgaXQgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqIERvZXMgTk9UIHVwZGF0ZSB0aGUgY29sbGVjdGlvbiAodGhlIHJlZHVjZXIncyBqb2IpLlxuICAgKiBAcGFyYW0gZW50aXRpZXMgVGhlIGVudGl0eSB0byBhZGQgb3IgdXBkYXRlLiBJdCBtdXN0IGJlIGEgY29tcGxldGUgZW50aXR5IHdpdGggaXRzIGlkLlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIFttZXJnZVN0cmF0ZWd5XSBUcmFjayBieSBkZWZhdWx0LiBEb24ndCB0cmFjayBpZiBpcyBNZXJnZVN0cmF0ZWd5Lklnbm9yZUNoYW5nZXMuXG4gICAqL1xuICB0cmFja1Vwc2VydE9uZShcbiAgICBlbnRpdHk6IFQsXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICBtZXJnZVN0cmF0ZWd5PzogTWVyZ2VTdHJhdGVneVxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gZW50aXR5ID09IG51bGxcbiAgICAgID8gY29sbGVjdGlvblxuICAgICAgOiB0aGlzLnRyYWNrVXBzZXJ0TWFueShbZW50aXR5XSwgY29sbGVjdGlvbiwgbWVyZ2VTdHJhdGVneSk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiB0cmFjayBtZXRob2RzXG5cbiAgLy8gI3JlZ2lvbiB1bmRvIG1ldGhvZHNcbiAgLyoqXG4gICAqIFJldmVydCB0aGUgdW5zYXZlZCBjaGFuZ2VzIGZvciBhbGwgY29sbGVjdGlvbi5cbiAgICogSGFybWxlc3Mgd2hlbiB0aGVyZSBhcmUgbm8gZW50aXR5IGNoYW5nZXMgdG8gdW5kby5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICB1bmRvQWxsKGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD4pOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICBjb25zdCBpZHMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9uLmNoYW5nZVN0YXRlKTtcblxuICAgIGNvbnN0IHsgcmVtb3ZlLCB1cHNlcnQgfSA9IGlkcy5yZWR1Y2UoXG4gICAgICAoYWNjLCBpZCkgPT4ge1xuICAgICAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IGFjYy5jaGdTdGF0ZVtpZF0hO1xuICAgICAgICBzd2l0Y2ggKGNoYW5nZVN0YXRlLmNoYW5nZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuQWRkZWQ6XG4gICAgICAgICAgICBhY2MucmVtb3ZlLnB1c2goaWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDaGFuZ2VUeXBlLkRlbGV0ZWQ6XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gY2hhbmdlU3RhdGUhLm9yaWdpbmFsVmFsdWU7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2gocmVtb3ZlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuVXBkYXRlZDpcbiAgICAgICAgICAgIGFjYy51cHNlcnQucHVzaChjaGFuZ2VTdGF0ZSEub3JpZ2luYWxWYWx1ZSEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICAvLyBlbnRpdGllc1RvVW5kb1xuICAgICAge1xuICAgICAgICByZW1vdmU6IFtdIGFzIChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgICAgIHVwc2VydDogW10gYXMgVFtdLFxuICAgICAgICBjaGdTdGF0ZTogY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KHJlbW92ZSBhcyBzdHJpbmdbXSwgY29sbGVjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KHVwc2VydCwgY29sbGVjdGlvbik7XG5cbiAgICByZXR1cm4geyAuLi5jb2xsZWN0aW9uLCBjaGFuZ2VTdGF0ZToge30gfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXZlcnQgdGhlIHVuc2F2ZWQgY2hhbmdlcyBmb3IgdGhlIGdpdmVuIGVudGl0aWVzLlxuICAgKiBIYXJtbGVzcyB3aGVuIHRoZXJlIGFyZSBubyBlbnRpdHkgY2hhbmdlcyB0byB1bmRvLlxuICAgKiBAcGFyYW0gZW50aXR5T3JJZExpc3QgVGhlIGVudGl0aWVzIHRvIHJldmVydCBvciB0aGVpciBpZHMuXG4gICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBlbnRpdHkgY29sbGVjdGlvblxuICAgKi9cbiAgdW5kb01hbnkoXG4gICAgZW50aXR5T3JJZExpc3Q6IChudW1iZXIgfCBzdHJpbmcgfCBUKVtdLFxuICAgIGNvbGxlY3Rpb246IEVudGl0eUNvbGxlY3Rpb248VD5cbiAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgaWYgKGVudGl0eU9ySWRMaXN0ID09IG51bGwgfHwgZW50aXR5T3JJZExpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjsgLy8gbm90aGluZyB0byB1bmRvXG4gICAgfVxuICAgIGxldCBkaWRNdXRhdGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHsgY2hhbmdlU3RhdGUsIHJlbW92ZSwgdXBzZXJ0IH0gPSBlbnRpdHlPcklkTGlzdC5yZWR1Y2UoXG4gICAgICAoYWNjLCBlbnRpdHlPcklkKSA9PiB7XG4gICAgICAgIGxldCBjaGdTdGF0ZSA9IGFjYy5jaGFuZ2VTdGF0ZTtcbiAgICAgICAgY29uc3QgaWQgPVxuICAgICAgICAgIHR5cGVvZiBlbnRpdHlPcklkID09PSAnb2JqZWN0J1xuICAgICAgICAgICAgPyB0aGlzLnNlbGVjdElkKGVudGl0eU9ySWQpXG4gICAgICAgICAgICA6IChlbnRpdHlPcklkIGFzIHN0cmluZyB8IG51bWJlcik7XG4gICAgICAgIGNvbnN0IGNoYW5nZSA9IGNoZ1N0YXRlW2lkXSE7XG4gICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICBpZiAoIWRpZE11dGF0ZSkge1xuICAgICAgICAgICAgY2hnU3RhdGUgPSB7IC4uLmNoZ1N0YXRlIH07XG4gICAgICAgICAgICBkaWRNdXRhdGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgY2hnU3RhdGVbaWRdOyAvLyBjbGVhciB0cmFja2luZyBvZiB0aGlzIGVudGl0eVxuICAgICAgICAgIGFjYy5jaGFuZ2VTdGF0ZSA9IGNoZ1N0YXRlO1xuICAgICAgICAgIHN3aXRjaCAoY2hhbmdlLmNoYW5nZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQ2hhbmdlVHlwZS5BZGRlZDpcbiAgICAgICAgICAgICAgYWNjLnJlbW92ZS5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuRGVsZXRlZDpcbiAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IGNoYW5nZSEub3JpZ2luYWxWYWx1ZTtcbiAgICAgICAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICBhY2MudXBzZXJ0LnB1c2gocmVtb3ZlZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENoYW5nZVR5cGUuVXBkYXRlZDpcbiAgICAgICAgICAgICAgYWNjLnVwc2VydC5wdXNoKGNoYW5nZSEub3JpZ2luYWxWYWx1ZSEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICAvLyBlbnRpdGllc1RvVW5kb1xuICAgICAge1xuICAgICAgICByZW1vdmU6IFtdIGFzIChudW1iZXIgfCBzdHJpbmcpW10sXG4gICAgICAgIHVwc2VydDogW10gYXMgVFtdLFxuICAgICAgICBjaGFuZ2VTdGF0ZTogY29sbGVjdGlvbi5jaGFuZ2VTdGF0ZSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci5yZW1vdmVNYW55KHJlbW92ZSBhcyBzdHJpbmdbXSwgY29sbGVjdGlvbik7XG4gICAgY29sbGVjdGlvbiA9IHRoaXMuYWRhcHRlci51cHNlcnRNYW55KHVwc2VydCwgY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGRpZE11dGF0ZSA/IHsgLi4uY29sbGVjdGlvbiwgY2hhbmdlU3RhdGUgfSA6IGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogUmV2ZXJ0IHRoZSB1bnNhdmVkIGNoYW5nZXMgZm9yIHRoZSBnaXZlbiBlbnRpdHkuXG4gICAqIEhhcm1sZXNzIHdoZW4gdGhlcmUgYXJlIG5vIGVudGl0eSBjaGFuZ2VzIHRvIHVuZG8uXG4gICAqIEBwYXJhbSBlbnRpdHlPcklkIFRoZSBlbnRpdHkgdG8gcmV2ZXJ0IG9yIGl0cyBpZC5cbiAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAqL1xuICB1bmRvT25lKFxuICAgIGVudGl0eU9ySWQ6IG51bWJlciB8IHN0cmluZyB8IFQsXG4gICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPlxuICApOiBFbnRpdHlDb2xsZWN0aW9uPFQ+IHtcbiAgICByZXR1cm4gZW50aXR5T3JJZCA9PSBudWxsXG4gICAgICA/IGNvbGxlY3Rpb25cbiAgICAgIDogdGhpcy51bmRvTWFueShbZW50aXR5T3JJZF0sIGNvbGxlY3Rpb24pO1xuICB9XG4gIC8vICNlbmRyZWdpb24gdW5kbyBtZXRob2RzXG59XG4iXX0=