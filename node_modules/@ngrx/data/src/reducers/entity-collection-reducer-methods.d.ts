import { EntityAdapter, IdSelector, Update } from '@ngrx/entity';
import { ChangeStateMap, EntityCollection } from './entity-collection';
import { EntityAction } from '../actions/entity-action';
import { EntityActionDataServiceError } from '../dataservices/data-service-error';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityChangeTracker } from './entity-change-tracker';
import { EntityDefinition } from '../entity-metadata/entity-definition';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { MergeStrategy } from '../actions/merge-strategy';
import { UpdateResponseData } from '../actions/update-response-data';
import * as i0 from "@angular/core";
/**
 * Map of {EntityOp} to reducer method for the operation.
 * If an operation is missing, caller should return the collection for that reducer.
 */
export interface EntityCollectionReducerMethodMap<T> {
    [method: string]: (collection: EntityCollection<T>, action: EntityAction) => EntityCollection<T>;
}
/**
 * Base implementation of reducer methods for an entity collection.
 */
export declare class EntityCollectionReducerMethods<T> {
    entityName: string;
    definition: EntityDefinition<T>;
    protected adapter: EntityAdapter<T>;
    protected guard: EntityActionGuard<T>;
    /** True if this collection tracks unsaved changes */
    protected isChangeTracking: boolean;
    /** Extract the primary key (id); default to `id` */
    selectId: IdSelector<T>;
    /**
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     */
    entityChangeTracker: EntityChangeTracker<T>;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `id`: the primary key and
     * `changes`: the entity (or partial entity of changes).
     */
    protected toUpdate: (entity: Partial<T>) => Update<T>;
    /**
     * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
     * keyed by the {EntityOp}
     */
    readonly methods: EntityCollectionReducerMethodMap<T>;
    constructor(entityName: string, definition: EntityDefinition<T>, entityChangeTracker?: EntityChangeTracker<T>);
    /** Cancel a persistence operation */
    protected cancelPersist(collection: EntityCollection<T>): EntityCollection<T>;
    protected queryAll(collection: EntityCollection<T>): EntityCollection<T>;
    protected queryAllError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    protected queryAllSuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected queryByKey(collection: EntityCollection<T>, action: EntityAction<number | string>): EntityCollection<T>;
    protected queryByKeyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    protected queryByKeySuccess(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    protected queryLoad(collection: EntityCollection<T>): EntityCollection<T>;
    protected queryLoadError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    protected queryLoadSuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected queryMany(collection: EntityCollection<T>, action: EntityAction): EntityCollection<T>;
    protected queryManyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    protected queryManySuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    /**
     * Save multiple new entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of entities.
     * If saving optimistically, the entities must have their keys.
     */
    protected saveAddMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    /**
     * Attempt to save new entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveAddManyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved new entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field),
     * and may even return additional new entities.
     * Therefore, upsert the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     * Note: saveAddManySuccess differs from saveAddOneSuccess when optimistic.
     * saveAddOneSuccess updates (not upserts) with the lone entity from the server.
     * There is no effect if the entity is not already in cache.
     * saveAddManySuccess will add an entity if it is not found in cache.
     */
    protected saveAddManySuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    /**
     * Save a new entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add entity immediately.
     * @param collection The collection to which the entity should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an entity.
     * If saving optimistically, the entity must have a key.
     */
    protected saveAddOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    /**
     * Attempt to save a new entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entity is in the collection and
     * you may need to compensate for the error.
     */
    protected saveAddOneError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved a new entity to the server.
     * If saved pessimistically, add the entity from the server to the collection.
     * If saved optimistically, the added entity is already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveAddOneSuccess(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    /**
     * Delete an entity from the server by key and remove it from the collection (if present).
     * If the entity is an unsaved new entity, remove it from the collection immediately
     * and skip the server delete request.
     * An optimistic save removes an existing entity from the collection immediately;
     * a pessimistic save removes it after the server confirms successful delete.
     * @param collection Will remove the entity with this key from the collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a primary key or an entity with a key;
     * this reducer extracts the key from the entity.
     */
    protected saveDeleteOne(collection: EntityCollection<T>, action: EntityAction<number | string | T>): EntityCollection<T>;
    /**
     * Attempt to delete the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entity is not in the collection and
     * you may need to compensate for the error.
     */
    protected saveDeleteOneError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    protected saveDeleteOneSuccess(collection: EntityCollection<T>, action: EntityAction<number | string>): EntityCollection<T>;
    /**
     * Delete multiple entities from the server by key and remove them from the collection (if present).
     * Removes unsaved new entities from the collection immediately
     * but the id is still sent to the server for deletion even though the server will not find that entity.
     * Therefore, the server must be willing to ignore a delete request for an entity it cannot find.
     * An optimistic save removes existing entities from the collection immediately;
     * a pessimistic save removes them after the server confirms successful delete.
     * @param collection Removes entities from this collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of primary keys or entities with a key;
     * this reducer extracts the key from the entity.
     */
    protected saveDeleteMany(collection: EntityCollection<T>, action: EntityAction<(number | string | T)[]>): EntityCollection<T>;
    /**
     * Attempt to delete the entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entities are not in the collection and
     * you may need to compensate for the error.
     */
    protected saveDeleteManyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    protected saveDeleteManySuccess(collection: EntityCollection<T>, action: EntityAction<(number | string)[]>): EntityCollection<T>;
    /**
     * Save an update to an existing entity.
     * If saving pessimistically, update the entity in the collection after the server confirms success.
     * If saving optimistically, update the entity immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an {Update<T>}
     */
    protected saveUpdateOne(collection: EntityCollection<T>, action: EntityAction<Update<T>>): EntityCollection<T>;
    /**
     * Attempt to update the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity in the collection is in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entity in the collection was updated
     * and you may need to compensate for the error.
     */
    protected saveUpdateOneError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved the updated entity to the server.
     * If saved pessimistically, update the entity in the collection with data from the server.
     * If saved optimistically, the entity was already updated in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic, and
     * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
     * You must include an UpdateResponse even if the save was optimistic,
     * to ensure that the change tracking is properly reset.
     */
    protected saveUpdateOneSuccess(collection: EntityCollection<T>, action: EntityAction<UpdateResponseData<T>>): EntityCollection<T>;
    /**
     * Save updated entities.
     * If saving pessimistically, update the entities in the collection after the server confirms success.
     * If saving optimistically, update the entities immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of {Update<T>}.
     */
    protected saveUpdateMany(collection: EntityCollection<T>, action: EntityAction<Update<T>[]>): EntityCollection<T>;
    /**
     * Attempt to update entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities in the collection are in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entities in the collection were updated
     * and you may need to compensate for the error.
     */
    protected saveUpdateManyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved the updated entities to the server.
     * If saved pessimistically, the entities in the collection will be updated with data from the server.
     * If saved optimistically, the entities in the collection were already updated.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of UpdateResponse<T>.
     * You must include an UpdateResponse for every Update sent to the server,
     * even if the save was optimistic, to ensure that the change tracking is properly reset.
     */
    protected saveUpdateManySuccess(collection: EntityCollection<T>, action: EntityAction<UpdateResponseData<T>[]>): EntityCollection<T>;
    /**
     * Save a new or existing entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entity should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a whole entity.
     * If saving optimistically, the entity must have its key.
     */
    protected saveUpsertOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    /**
     * Attempt to save new or existing entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new or updated entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveUpsertOneError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveUpsertOneSuccess(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    /**
     * Save multiple new or existing entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of whole entities.
     * If saving optimistically, the entities must have their keys.
     */
    protected saveUpsertMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    /**
     * Attempt to save new or existing entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveUpsertManyError(collection: EntityCollection<T>, action: EntityAction<EntityActionDataServiceError>): EntityCollection<T>;
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveUpsertManySuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true.
     * Merges query results, preserving unsaved changes
     */
    protected addAll(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected addMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected addOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    protected removeMany(collection: EntityCollection<T>, action: EntityAction<number[] | string[]>): EntityCollection<T>;
    protected removeOne(collection: EntityCollection<T>, action: EntityAction<number | string>): EntityCollection<T>;
    protected removeAll(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    protected updateMany(collection: EntityCollection<T>, action: EntityAction<Update<T>[]>): EntityCollection<T>;
    protected updateOne(collection: EntityCollection<T>, action: EntityAction<Update<T>>): EntityCollection<T>;
    protected upsertMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected upsertOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    protected commitAll(collection: EntityCollection<T>): EntityCollection<T>;
    protected commitMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected commitOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    protected undoAll(collection: EntityCollection<T>): EntityCollection<T>;
    protected undoMany(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T>;
    protected undoOne(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T>;
    /** Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely. */
    protected setChangeState(collection: EntityCollection<T>, action: EntityAction<ChangeStateMap<T>>): EntityCollection<T>;
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     */
    protected setCollection(collection: EntityCollection<T>, action: EntityAction<EntityCollection<T>>): EntityCollection<T>;
    protected setFilter(collection: EntityCollection<T>, action: EntityAction<any>): EntityCollection<T>;
    protected setLoaded(collection: EntityCollection<T>, action: EntityAction<boolean>): EntityCollection<T>;
    protected setLoading(collection: EntityCollection<T>, action: EntityAction<boolean>): EntityCollection<T>;
    protected setLoadingFalse(collection: EntityCollection<T>): EntityCollection<T>;
    protected setLoadingTrue(collection: EntityCollection<T>): EntityCollection<T>;
    /** Set the collection's loading flag */
    protected setLoadingFlag(collection: EntityCollection<T>, loading: boolean): EntityCollection<T>;
    /** Safely extract data from the EntityAction payload */
    protected extractData<D = any>(action: EntityAction<D>): D;
    /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    protected extractMergeStrategy(action: EntityAction): MergeStrategy;
    protected isOptimistic(action: EntityAction): boolean;
}
/**
 * Creates {EntityCollectionReducerMethods} for a given entity type.
 */
export declare class EntityCollectionReducerMethodsFactory {
    private entityDefinitionService;
    constructor(entityDefinitionService: EntityDefinitionService);
    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    create<T>(entityName: string): EntityCollectionReducerMethodMap<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCollectionReducerMethodsFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCollectionReducerMethodsFactory>;
}
