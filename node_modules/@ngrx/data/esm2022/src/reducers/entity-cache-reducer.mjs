import { Injectable } from '@angular/core';
import { EntityCacheAction, } from '../actions/entity-cache-action';
import { ChangeSetOperation, } from '../actions/entity-cache-change-set';
import { EntityOp } from '../actions/entity-op';
import { MergeStrategy } from '../actions/merge-strategy';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-creator";
import * as i2 from "./entity-collection-reducer-registry";
import * as i3 from "../utils/interfaces";
/**
 * Creates the EntityCacheReducer via its create() method
 */
export class EntityCacheReducerFactory {
    constructor(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
        this.entityCollectionCreator = entityCollectionCreator;
        this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
        this.logger = logger;
    }
    /**
     * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    create() {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        function entityCacheReducer(entityCache = {}, action) {
            // EntityCache actions
            switch (action.type) {
                case EntityCacheAction.CLEAR_COLLECTIONS: {
                    return this.clearCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.LOAD_COLLECTIONS: {
                    return this.loadCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.MERGE_QUERY_SET: {
                    return this.mergeQuerySetReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES: {
                    return this.saveEntitiesReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                    return this.saveEntitiesCancelReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_ERROR: {
                    return this.saveEntitiesErrorReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                    return this.saveEntitiesSuccessReducer(entityCache, action);
                }
                case EntityCacheAction.SET_ENTITY_CACHE: {
                    // Completely replace the EntityCache. Be careful!
                    return action.payload.cache;
                }
            }
            // Apply entity collection reducer if this is a valid EntityAction for a collection
            const payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, action);
            }
            // Not a valid EntityAction
            return entityCache;
        }
    }
    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    clearCollectionsReducer(entityCache, action) {
        // eslint-disable-next-line prefer-const
        let { collections, tag } = action.payload;
        const entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce((newCache, entityName) => {
            const payload = { entityName, entityOp };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    loadCollectionsReducer(entityCache, action) {
        const { collections, tag } = action.payload;
        const entityOp = EntityOp.ADD_ALL;
        const entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: collections[entityName],
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    mergeQuerySetReducer(entityCache, action) {
        // eslint-disable-next-line prefer-const
        let { mergeStrategy, querySet, tag } = action.payload;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        const entityOp = EntityOp.QUERY_MANY_SUCCESS;
        const entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: querySet[entityName],
                mergeStrategy,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    // #region saveEntities reducers
    saveEntitiesReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
        try {
            changeSet.changes.forEach((item) => {
                const entityName = item.entityName;
                const payload = {
                    entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId,
                    isOptimistic,
                    mergeStrategy,
                    tag,
                };
                const act = {
                    type: `[${entityName}] ${action.type}`,
                    payload,
                };
                entityCache = this.applyCollectionReducer(entityCache, act);
                if (act.payload.error) {
                    throw act.payload.error;
                }
            });
        }
        catch (error) {
            action.payload.error = error;
        }
        return entityCache;
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY;
            }
        }
    }
    saveEntitiesCancelReducer(entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    }
    saveEntitiesErrorReducer(entityCache, action) {
        const originalAction = action.payload.originalAction;
        const originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        const entityNames = originalChangeSet.changes.map((item) => item.entityName);
        return this.clearLoadingFlags(entityCache, entityNames);
    }
    saveEntitiesSuccessReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
        changeSet.changes.forEach((item) => {
            const entityName = item.entityName;
            const payload = {
                entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId,
                isOptimistic,
                mergeStrategy,
                tag,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            entityCache = this.applyCollectionReducer(entityCache, act);
        });
        return entityCache;
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY_SUCCESS;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY_SUCCESS;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
            }
        }
    }
    // #endregion saveEntities reducers
    // #region helpers
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    applyCollectionReducer(cache = {}, action) {
        const entityName = action.payload.entityName;
        const collection = cache[entityName];
        const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
        let newCollection;
        try {
            newCollection = collection
                ? reducer(collection, action)
                : reducer(this.entityCollectionCreator.create(entityName), action);
        }
        catch (error) {
            this.logger.error(error);
            action.payload.error = error;
        }
        return action.payload.error || collection === newCollection
            ? cache
            : { ...cache, [entityName]: newCollection };
    }
    /** Ensure loading is false for every collection in entityNames */
    clearLoadingFlags(entityCache, entityNames) {
        let isMutated = false;
        entityNames.forEach((entityName) => {
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = { ...entityCache };
                    isMutated = true;
                }
                entityCache[entityName] = { ...collection, loading: false };
            }
        });
        return entityCache;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory, deps: [{ token: i1.EntityCollectionCreator }, { token: i2.EntityCollectionReducerRegistry }, { token: i3.Logger }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionCreator }, { type: i2.EntityCollectionReducerRegistry }, { type: i3.Logger }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLXJlZHVjZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3JlZHVjZXJzL2VudGl0eS1jYWNoZS1yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNM0MsT0FBTyxFQUNMLGlCQUFpQixHQVFsQixNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE9BQU8sRUFDTCxrQkFBa0IsR0FFbkIsTUFBTSxvQ0FBb0MsQ0FBQztBQUs1QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7OztBQUUxRDs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFDVSx1QkFBZ0QsRUFDaEQsK0JBQWdFLEVBQ2hFLE1BQWM7UUFGZCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDaEUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUNyQixDQUFDO0lBRUo7OztPQUdHO0lBQ0gsTUFBTTtRQUNKLGtFQUFrRTtRQUNsRSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxTQUFTLGtCQUFrQixDQUV6QixjQUEyQixFQUFFLEVBQzdCLE1BQXVDO1lBRXZDLHNCQUFzQjtZQUN0QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUssaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDeEMsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQ2pDLFdBQVcsRUFDWCxNQUEwQixDQUMzQixDQUFDO2lCQUNIO2dCQUVELEtBQUssaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDdkMsT0FBTyxJ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QUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDZCxXQUFXLEdBQUcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO29CQUNqQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtnQkFDRCxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7YUFDN0Q7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7aUlBL1VVLHlCQUF5QjtxSUFBekIseUJBQXlCOzsyRkFBekIseUJBQXlCO2tCQURyQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25SZWR1Y2VyIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q2FjaGUgfSBmcm9tICcuL2VudGl0eS1jYWNoZSc7XG5cbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBDbGVhckNvbGxlY3Rpb25zLFxuICBMb2FkQ29sbGVjdGlvbnMsXG4gIE1lcmdlUXVlcnlTZXQsXG4gIFNhdmVFbnRpdGllcyxcbiAgU2F2ZUVudGl0aWVzQ2FuY2VsLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXRJdGVtLFxufSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbiB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3IgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLWNyZWF0b3InO1xuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeSc7XG5pbXBvcnQgeyBFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LW9wJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJy4uL3V0aWxzL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIEVudGl0eUNhY2hlUmVkdWNlciB2aWEgaXRzIGNyZWF0ZSgpIG1ldGhvZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVSZWR1Y2VyRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbkNyZWF0b3I6IEVudGl0eUNvbGxlY3Rpb25DcmVhdG9yLFxuICAgIHByaXZhdGUgZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSxcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyXG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBAbmdyeC9kYXRhIGVudGl0eSBjYWNoZSByZWR1Y2VyIHdoaWNoIGVpdGhlciByZXNwb25kcyB0byBlbnRpdHkgY2FjaGUgbGV2ZWwgYWN0aW9uc1xuICAgKiBvciAobW9yZSBjb21tb25seSkgZGVsZWdhdGVzIHRvIGFuIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyIGJhc2VkIG9uIHRoZSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lLlxuICAgKi9cbiAgY3JlYXRlKCk6IEFjdGlvblJlZHVjZXI8RW50aXR5Q2FjaGUsIEFjdGlvbj4ge1xuICAgIC8vIFRoaXMgdGVjaG5pcXVlIGVuc3VyZXMgYSBuYW1lZCBmdW5jdGlvbiBhcHBlYXJzIGluIHRoZSBkZWJ1Z2dlclxuICAgIHJldHVybiBlbnRpdHlDYWNoZVJlZHVjZXIuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGVudGl0eUNhY2hlUmVkdWNlcihcbiAgICAgIHRoaXM6IEVudGl0eUNhY2hlUmVkdWNlckZhY3RvcnksXG4gICAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUgPSB7fSxcbiAgICAgIGFjdGlvbjogeyB0eXBlOiBzdHJpbmc7IHBheWxvYWQ/OiBhbnkgfVxuICAgICk6IEVudGl0eUNhY2hlIHtcbiAgICAgIC8vIEVudGl0eUNhY2hlIGFjdGlvbnNcbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5DTEVBUl9DT0xMRUNUSU9OUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNsZWFyQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgQ2xlYXJDb2xsZWN0aW9uc1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIEVudGl0eUNhY2hlQWN0aW9uLkxPQURfQ09MTEVDVElPTlM6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkQ29sbGVjdGlvbnNSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgTG9hZENvbGxlY3Rpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uTUVSR0VfUVVFUllfU0VUOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2VRdWVyeVNldFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBNZXJnZVF1ZXJ5U2V0XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFUzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc1JlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBTYXZlRW50aXRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTDoge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVFbnRpdGllc0NhbmNlbFJlZHVjZXIoXG4gICAgICAgICAgICBlbnRpdHlDYWNoZSxcbiAgICAgICAgICAgIGFjdGlvbiBhcyBTYXZlRW50aXRpZXNDYW5jZWxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0VSUk9SOiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZUVudGl0aWVzRXJyb3JSZWR1Y2VyKFxuICAgICAgICAgICAgZW50aXR5Q2FjaGUsXG4gICAgICAgICAgICBhY3Rpb24gYXMgU2F2ZUVudGl0aWVzRXJyb3JcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1M6IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlRW50aXRpZXNTdWNjZXNzUmVkdWNlcihcbiAgICAgICAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgICAgICAgYWN0aW9uIGFzIFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBFbnRpdHlDYWNoZUFjdGlvbi5TRVRfRU5USVRZX0NBQ0hFOiB7XG4gICAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIHRoZSBFbnRpdHlDYWNoZS4gQmUgY2FyZWZ1bCFcbiAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuY2FjaGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgZW50aXR5IGNvbGxlY3Rpb24gcmVkdWNlciBpZiB0aGlzIGlzIGEgdmFsaWQgRW50aXR5QWN0aW9uIGZvciBhIGNvbGxlY3Rpb25cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ucGF5bG9hZDtcbiAgICAgIGlmIChwYXlsb2FkICYmIHBheWxvYWQuZW50aXR5TmFtZSAmJiBwYXlsb2FkLmVudGl0eU9wICYmICFwYXlsb2FkLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGx5Q29sbGVjdGlvblJlZHVjZXIoZW50aXR5Q2FjaGUsIGFjdGlvbiBhcyBFbnRpdHlBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3QgYSB2YWxpZCBFbnRpdHlBY3Rpb25cbiAgICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBjbGVhciBtdWx0aXBsZSBjb2xsZWN0aW9ucyBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiBAcGFyYW0gZW50aXR5Q2FjaGUgdGhlIGVudGl0eSBjYWNoZVxuICAgKiBAcGFyYW0gYWN0aW9uIGEgQ2xlYXJDb2xsZWN0aW9ucyBhY3Rpb24gd2hvc2UgcGF5bG9hZCBpcyBhbiBhcnJheSBvZiBjb2xsZWN0aW9uIG5hbWVzLlxuICAgKiBJZiBlbXB0eSBhcnJheSwgZG9lcyBub3RoaW5nLiBJZiBubyBhcnJheSwgY2xlYXJzIGFsbCB0aGUgY29sbGVjdGlvbnMuXG4gICAqL1xuICBwcm90ZWN0ZWQgY2xlYXJDb2xsZWN0aW9uc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogQ2xlYXJDb2xsZWN0aW9uc1xuICApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gICAgbGV0IHsgY29sbGVjdGlvbnMsIHRhZyB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgY29uc3QgZW50aXR5T3AgPSBFbnRpdHlPcC5SRU1PVkVfQUxMO1xuXG4gICAgaWYgKCFjb2xsZWN0aW9ucykge1xuICAgICAgLy8gQ29sbGVjdGlvbnMgaXMgbm90IGRlZmluZWQuIENsZWFyIGFsbCBjb2xsZWN0aW9ucy5cbiAgICAgIGNvbGxlY3Rpb25zID0gT2JqZWN0LmtleXMoZW50aXR5Q2FjaGUpO1xuICAgIH1cblxuICAgIGVudGl0eUNhY2hlID0gY29sbGVjdGlvbnMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHsgZW50aXR5TmFtZSwgZW50aXR5T3AgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZXIgdG8gbG9hZCBjb2xsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBMb2FkQ29sbGVjdGlvbnMgYWN0aW9uIHdob3NlIHBheWxvYWQgaXMgdGhlIFF1ZXJ5U2V0IG9mIGVudGl0eSBjb2xsZWN0aW9ucyB0byBsb2FkXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZENvbGxlY3Rpb25zUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBMb2FkQ29sbGVjdGlvbnNcbiAgKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9ucywgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLkFERF9BTEw7XG4gICAgY29uc3QgZW50aXR5TmFtZXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9ucyk7XG4gICAgZW50aXR5Q2FjaGUgPSBlbnRpdHlOYW1lcy5yZWR1Y2UoKG5ld0NhY2hlLCBlbnRpdHlOYW1lKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBlbnRpdHlPcCxcbiAgICAgICAgZGF0YTogY29sbGVjdGlvbnNbZW50aXR5TmFtZV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgYWN0OiBFbnRpdHlBY3Rpb24gPSB7XG4gICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgfTtcbiAgICAgIG5ld0NhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKG5ld0NhY2hlLCBhY3QpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlO1xuICAgIH0sIGVudGl0eUNhY2hlKTtcbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlciB0byBtZXJnZSBxdWVyeSBzZXRzIGluIHRoZSBmb3JtIG9mIGEgaGFzaCBvZiBlbnRpdHkgZGF0YSBmb3IgbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBlbnRpdHlDYWNoZSB0aGUgZW50aXR5IGNhY2hlXG4gICAqIEBwYXJhbSBhY3Rpb24gYSBNZXJnZVF1ZXJ5U2V0IGFjdGlvbiB3aXRoIHRoZSBxdWVyeSBzZXQgYW5kIGEgTWVyZ2VTdHJhdGVneVxuICAgKi9cbiAgcHJvdGVjdGVkIG1lcmdlUXVlcnlTZXRSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IE1lcmdlUXVlcnlTZXRcbiAgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICAgIGxldCB7IG1lcmdlU3RyYXRlZ3ksIHF1ZXJ5U2V0LCB0YWcgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIG1lcmdlU3RyYXRlZ3kgPVxuICAgICAgbWVyZ2VTdHJhdGVneSA9PT0gbnVsbCA/IE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzIDogbWVyZ2VTdHJhdGVneTtcbiAgICBjb25zdCBlbnRpdHlPcCA9IEVudGl0eU9wLlFVRVJZX01BTllfU1VDQ0VTUztcblxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gT2JqZWN0LmtleXMocXVlcnlTZXQpO1xuICAgIGVudGl0eUNhY2hlID0gZW50aXR5TmFtZXMucmVkdWNlKChuZXdDYWNoZSwgZW50aXR5TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3AsXG4gICAgICAgIGRhdGE6IHF1ZXJ5U2V0W2VudGl0eU5hbWVdLFxuICAgICAgICBtZXJnZVN0cmF0ZWd5LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBuZXdDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihuZXdDYWNoZSwgYWN0KTtcbiAgICAgIHJldHVybiBuZXdDYWNoZTtcbiAgICB9LCBlbnRpdHlDYWNoZSk7XG4gICAgcmV0dXJuIGVudGl0eUNhY2hlO1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBzYXZlRW50aXRpZXMgcmVkdWNlcnNcbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1JlZHVjZXIoXG4gICAgZW50aXR5Q2FjaGU6IEVudGl0eUNhY2hlLFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICkge1xuICAgIGNvbnN0IHsgY2hhbmdlU2V0LCBjb3JyZWxhdGlvbklkLCBpc09wdGltaXN0aWMsIG1lcmdlU3RyYXRlZ3ksIHRhZyB9ID1cbiAgICAgIGFjdGlvbi5wYXlsb2FkO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNoYW5nZVNldC5jaGFuZ2VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGl0ZW0uZW50aXR5TmFtZTtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICAgIGVudGl0eU9wOiBnZXRFbnRpdHlPcChpdGVtKSxcbiAgICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgaXNPcHRpbWlzdGljLFxuICAgICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgICAgdGFnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICAgIHR5cGU6IGBbJHtlbnRpdHlOYW1lfV0gJHthY3Rpb24udHlwZX1gLFxuICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgIH07XG4gICAgICAgIGVudGl0eUNhY2hlID0gdGhpcy5hcHBseUNvbGxlY3Rpb25SZWR1Y2VyKGVudGl0eUNhY2hlLCBhY3QpO1xuICAgICAgICBpZiAoYWN0LnBheWxvYWQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyBhY3QucGF5bG9hZC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgYWN0aW9uLnBheWxvYWQuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gZW50aXR5Q2FjaGU7XG4gICAgZnVuY3Rpb24gZ2V0RW50aXR5T3AoaXRlbTogQ2hhbmdlU2V0SXRlbSkge1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkFkZDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9BRERfTUFOWTtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uRGVsZXRlOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0RFTEVURV9NQU5ZO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTlk7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLlVwc2VydDpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9VUFNFUlRfTUFOWTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZUVudGl0aWVzQ2FuY2VsUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNDYW5jZWxcbiAgKSB7XG4gICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBjYW4gb25seSBjbGVhciB0aGUgbG9hZGluZyBmbGFnIGZvciB0aGUgY29sbGVjdGlvbnMgaW52b2x2ZWRcbiAgICAvLyBJZiB0aGUgc2F2ZSB3YXMgb3B0aW1pc3RpYywgeW91J2xsIGhhdmUgdG8gY29tcGVuc2F0ZSB0byBmaXggdGhlIGNhY2hlIGFzIHlvdSB0aGluayBuZWNlc3NhcnlcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhcbiAgICAgIGVudGl0eUNhY2hlLFxuICAgICAgYWN0aW9uLnBheWxvYWQuZW50aXR5TmFtZXMgfHwgW11cbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc0Vycm9yUmVkdWNlcihcbiAgICBlbnRpdHlDYWNoZTogRW50aXR5Q2FjaGUsXG4gICAgYWN0aW9uOiBTYXZlRW50aXRpZXNFcnJvclxuICApIHtcbiAgICBjb25zdCBvcmlnaW5hbEFjdGlvbiA9IGFjdGlvbi5wYXlsb2FkLm9yaWdpbmFsQWN0aW9uO1xuICAgIGNvbnN0IG9yaWdpbmFsQ2hhbmdlU2V0ID0gb3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQ7XG5cbiAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGNhbiBvbmx5IGNsZWFyIHRoZSBsb2FkaW5nIGZsYWcgZm9yIHRoZSBjb2xsZWN0aW9ucyBpbnZvbHZlZFxuICAgIC8vIElmIHRoZSBzYXZlIHdhcyBvcHRpbWlzdGljLCB5b3UnbGwgaGF2ZSB0byBjb21wZW5zYXRlIHRvIGZpeCB0aGUgY2FjaGUgYXMgeW91IHRoaW5rIG5lY2Vzc2FyeVxuICAgIGNvbnN0IGVudGl0eU5hbWVzID0gb3JpZ2luYWxDaGFuZ2VTZXQuY2hhbmdlcy5tYXAoXG4gICAgICAoaXRlbSkgPT4gaXRlbS5lbnRpdHlOYW1lXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhckxvYWRpbmdGbGFncyhlbnRpdHlDYWNoZSwgZW50aXR5TmFtZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVFbnRpdGllc1N1Y2Nlc3NSZWR1Y2VyKFxuICAgIGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSxcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllc1N1Y2Nlc3NcbiAgKSB7XG4gICAgY29uc3QgeyBjaGFuZ2VTZXQsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYywgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPVxuICAgICAgYWN0aW9uLnBheWxvYWQ7XG5cbiAgICBjaGFuZ2VTZXQuY2hhbmdlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBlbnRpdHlOYW1lID0gaXRlbS5lbnRpdHlOYW1lO1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgZW50aXR5TmFtZSxcbiAgICAgICAgZW50aXR5T3A6IGdldEVudGl0eU9wKGl0ZW0pLFxuICAgICAgICBkYXRhOiBpdGVtLmVudGl0aWVzLFxuICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICBpc09wdGltaXN0aWMsXG4gICAgICAgIG1lcmdlU3RyYXRlZ3ksXG4gICAgICAgIHRhZyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGFjdDogRW50aXR5QWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBgWyR7ZW50aXR5TmFtZX1dICR7YWN0aW9uLnR5cGV9YCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgIH07XG4gICAgICBlbnRpdHlDYWNoZSA9IHRoaXMuYXBwbHlDb2xsZWN0aW9uUmVkdWNlcihlbnRpdHlDYWNoZSwgYWN0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgICBmdW5jdGlvbiBnZXRFbnRpdHlPcChpdGVtOiBDaGFuZ2VTZXRJdGVtKSB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ub3ApIHtcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uQWRkOlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX0FERF9NQU5ZX1NVQ0NFU1M7XG4gICAgICAgIGNhc2UgQ2hhbmdlU2V0T3BlcmF0aW9uLkRlbGV0ZTpcbiAgICAgICAgICByZXR1cm4gRW50aXR5T3AuU0FWRV9ERUxFVEVfTUFOWV9TVUNDRVNTO1xuICAgICAgICBjYXNlIENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU6XG4gICAgICAgICAgcmV0dXJuIEVudGl0eU9wLlNBVkVfVVBEQVRFX01BTllfU1VDQ0VTUztcbiAgICAgICAgY2FzZSBDaGFuZ2VTZXRPcGVyYXRpb24uVXBzZXJ0OlxuICAgICAgICAgIHJldHVybiBFbnRpdHlPcC5TQVZFX1VQU0VSVF9NQU5ZX1NVQ0NFU1M7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vICNlbmRyZWdpb24gc2F2ZUVudGl0aWVzIHJlZHVjZXJzXG5cbiAgLy8gI3JlZ2lvbiBoZWxwZXJzXG4gIC8qKiBBcHBseSByZWR1Y2VyIGZvciB0aGUgYWN0aW9uJ3MgRW50aXR5Q29sbGVjdGlvbiAoaWYgdGhlIGFjdGlvbiB0YXJnZXRzIGEgY29sbGVjdGlvbikgKi9cbiAgcHJpdmF0ZSBhcHBseUNvbGxlY3Rpb25SZWR1Y2VyKFxuICAgIGNhY2hlOiBFbnRpdHlDYWNoZSA9IHt9LFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICkge1xuICAgIGNvbnN0IGVudGl0eU5hbWUgPSBhY3Rpb24ucGF5bG9hZC5lbnRpdHlOYW1lO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjYWNoZVtlbnRpdHlOYW1lXTtcbiAgICBjb25zdCByZWR1Y2VyID1cbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeS5nZXRPckNyZWF0ZVJlZHVjZXIoZW50aXR5TmFtZSk7XG5cbiAgICBsZXQgbmV3Q29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjtcbiAgICB0cnkge1xuICAgICAgbmV3Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cbiAgICAgICAgPyByZWR1Y2VyKGNvbGxlY3Rpb24sIGFjdGlvbilcbiAgICAgICAgOiByZWR1Y2VyKHRoaXMuZW50aXR5Q29sbGVjdGlvbkNyZWF0b3IuY3JlYXRlKGVudGl0eU5hbWUpLCBhY3Rpb24pO1xuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgIGFjdGlvbi5wYXlsb2FkLmVycm9yID0gZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLmVycm9yIHx8IGNvbGxlY3Rpb24gPT09IG5ld0NvbGxlY3Rpb24hXG4gICAgICA/IGNhY2hlXG4gICAgICA6IHsgLi4uY2FjaGUsIFtlbnRpdHlOYW1lXTogbmV3Q29sbGVjdGlvbiEgfTtcbiAgfVxuXG4gIC8qKiBFbnN1cmUgbG9hZGluZyBpcyBmYWxzZSBmb3IgZXZlcnkgY29sbGVjdGlvbiBpbiBlbnRpdHlOYW1lcyAqL1xuICBwcml2YXRlIGNsZWFyTG9hZGluZ0ZsYWdzKGVudGl0eUNhY2hlOiBFbnRpdHlDYWNoZSwgZW50aXR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgbGV0IGlzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGVudGl0eU5hbWVzLmZvckVhY2goKGVudGl0eU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBlbnRpdHlDYWNoZVtlbnRpdHlOYW1lXTtcbiAgICAgIGlmIChjb2xsZWN0aW9uLmxvYWRpbmcpIHtcbiAgICAgICAgaWYgKCFpc011dGF0ZWQpIHtcbiAgICAgICAgICBlbnRpdHlDYWNoZSA9IHsgLi4uZW50aXR5Q2FjaGUgfTtcbiAgICAgICAgICBpc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVudGl0eUNhY2hlW2VudGl0eU5hbWVdID0geyAuLi5jb2xsZWN0aW9uLCBsb2FkaW5nOiBmYWxzZSB9O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlbnRpdHlDYWNoZTtcbiAgfVxuICAvLyAjZW5kcmVnaW9uIGhlbHBlcnNcbn1cbiJdfQ==