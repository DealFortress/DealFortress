import { Action } from '@ngrx/store';
import { ChangeSet } from './entity-cache-change-set';
export { ChangeSet, ChangeSetOperation } from './entity-cache-change-set';
import { DataServiceError } from '../dataservices/data-service-error';
import { EntityActionOptions } from '../actions/entity-action';
import { EntityCache } from '../reducers/entity-cache';
import { MergeStrategy } from '../actions/merge-strategy';
export declare enum EntityCacheAction {
    CLEAR_COLLECTIONS = "@ngrx/data/entity-cache/clear-collections",
    LOAD_COLLECTIONS = "@ngrx/data/entity-cache/load-collections",
    MERGE_QUERY_SET = "@ngrx/data/entity-cache/merge-query-set",
    SET_ENTITY_CACHE = "@ngrx/data/entity-cache/set-cache",
    SAVE_ENTITIES = "@ngrx/data/entity-cache/save-entities",
    SAVE_ENTITIES_CANCEL = "@ngrx/data/entity-cache/save-entities-cancel",
    SAVE_ENTITIES_CANCELED = "@ngrx/data/entity-cache/save-entities-canceled",
    SAVE_ENTITIES_ERROR = "@ngrx/data/entity-cache/save-entities-error",
    SAVE_ENTITIES_SUCCESS = "@ngrx/data/entity-cache/save-entities-success"
}
/**
 * Hash of entities keyed by EntityCollection name,
 * typically the result of a query that returned results from a multi-collection query
 * that will be merged into an EntityCache via the `MergeQuerySet` action.
 */
export interface EntityCacheQuerySet {
    [entityName: string]: any[];
}
/**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export declare class ClearCollections implements Action {
    readonly payload: {
        collections?: string[];
        tag?: string;
    };
    readonly type = EntityCacheAction.CLEAR_COLLECTIONS;
    constructor(collections?: string[], tag?: string);
}
/**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
export declare class LoadCollections implements Action {
    readonly payload: {
        collections: EntityCacheQuerySet;
        tag?: string;
    };
    readonly type = EntityCacheAction.LOAD_COLLECTIONS;
    constructor(collections: EntityCacheQuerySet, tag?: string);
}
/**
 * Create entity cache action that merges entities from a query result
 * that returned entities from multiple collections.
 * Corresponding entity cache reducer should add and update all collections
 * at the same time, before any selectors$ observables emit.
 * @param querySet The result of the query in the form of a map of entity collections.
 * These are the entity data to merge into the respective collections.
 * @param mergeStrategy How to merge a queried entity when it is already in the collection.
 * The default is MergeStrategy.PreserveChanges
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export declare class MergeQuerySet implements Action {
    readonly payload: {
        querySet: EntityCacheQuerySet;
        mergeStrategy?: MergeStrategy;
        tag?: string;
    };
    readonly type = EntityCacheAction.MERGE_QUERY_SET;
    constructor(querySet: EntityCacheQuerySet, mergeStrategy?: MergeStrategy, tag?: string);
}
/**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an EntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export declare class SetEntityCache implements Action {
    readonly cache: EntityCache;
    readonly payload: {
        cache: EntityCache;
        tag?: string;
    };
    readonly type = EntityCacheAction.SET_ENTITY_CACHE;
    constructor(cache: EntityCache, tag?: string);
}
export declare class SaveEntities implements Action {
    readonly payload: {
        readonly changeSet: ChangeSet;
        readonly url: string;
        readonly correlationId?: any;
        readonly isOptimistic?: boolean;
        readonly mergeStrategy?: MergeStrategy;
        readonly tag?: string;
        error?: Error;
        skip?: boolean;
    };
    readonly type = EntityCacheAction.SAVE_ENTITIES;
    constructor(changeSet: ChangeSet, url: string, options?: EntityActionOptions);
}
export declare class SaveEntitiesCancel implements Action {
    readonly payload: {
        readonly correlationId: any;
        readonly reason?: string;
        readonly entityNames?: string[];
        readonly tag?: string;
    };
    readonly type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
    constructor(correlationId: any, reason?: string, entityNames?: string[], tag?: string);
}
export declare class SaveEntitiesCanceled implements Action {
    readonly payload: {
        readonly correlationId: any;
        readonly reason?: string;
        readonly tag?: string;
    };
    readonly type = EntityCacheAction.SAVE_ENTITIES_CANCELED;
    constructor(correlationId: any, reason?: string, tag?: string);
}
export declare class SaveEntitiesError {
    readonly payload: {
        readonly error: DataServiceError;
        readonly originalAction: SaveEntities;
        readonly correlationId: any;
    };
    readonly type = EntityCacheAction.SAVE_ENTITIES_ERROR;
    constructor(error: DataServiceError, originalAction: SaveEntities);
}
export declare class SaveEntitiesSuccess implements Action {
    readonly payload: {
        readonly changeSet: ChangeSet;
        readonly url: string;
        readonly correlationId?: any;
        readonly isOptimistic?: boolean;
        readonly mergeStrategy?: MergeStrategy;
        readonly tag?: string;
        error?: Error;
        skip?: boolean;
    };
    readonly type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
    constructor(changeSet: ChangeSet, url: string, options?: EntityActionOptions);
}
