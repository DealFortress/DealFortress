import { Action, Store } from '@ngrx/store';
import { IdSelector, Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityAction, EntityActionOptions } from '../actions/entity-action';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCacheSelector } from '../selectors/entity-cache-selector';
import { EntityDispatcher } from './entity-dispatcher';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { EntityOp } from '../actions/entity-op';
import { QueryParams } from '../dataservices/interfaces';
/**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 */
export declare class EntityDispatcherBase<T> implements EntityDispatcher<T> {
    /** Name of the entity type for which entities are dispatched */
    entityName: string;
    /** Creates an {EntityAction} */
    entityActionFactory: EntityActionFactory;
    /** The store, scoped to the EntityCache */
    store: Store<EntityCache>;
    /** Returns the primary key (id) of this entity */
    selectId: IdSelector<T>;
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    private defaultDispatcherOptions;
    /** Actions scanned by the store after it processed them with reducers. */
    private reducedActions$;
    /** Generates correlation ids for query and save methods */
    private correlationIdGenerator;
    /** Utility class with methods to validate EntityAction payloads.*/
    guard: EntityActionGuard<T>;
    private entityCollection$;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     */
    toUpdate: (entity: Partial<T>) => Update<T>;
    constructor(
    /** Name of the entity type for which entities are dispatched */
    entityName: string, 
    /** Creates an {EntityAction} */
    entityActionFactory: EntityActionFactory, 
    /** The store, scoped to the EntityCache */
    store: Store<EntityCache>, 
    /** Returns the primary key (id) of this entity */
    selectId: IdSelector<T>, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions: EntityDispatcherDefaultOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    reducedActions$: Observable<Action>, 
    /** Store selector for the EntityCache */
    entityCacheSelector: EntityCacheSelector, 
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator: CorrelationIdGenerator);
    /**
     * Create an {EntityAction} for this entity type.
     * @param entityOp {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    createEntityAction<P = any>(entityOp: EntityOp, data?: P, options?: EntityActionOptions): EntityAction<P>;
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the dispatched EntityAction
     */
    createAndDispatch<P = any>(op: EntityOp, data?: P, options?: EntityActionOptions): EntityAction<P>;
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action: Action): Action;
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    add(entity: T, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     */
    cancel(correlationId: any, reason?: string, options?: EntityActionOptions): void;
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The primary key of the entity to remove
     * @returns A terminating Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(entity: T, options?: EntityActionOptions): Observable<number | string>;
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The entity to delete
     * @returns A terminating Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(key: number | string, options?: EntityActionOptions): Observable<number | string>;
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @returns A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     * @see load()
     */
    getAll(options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @returns A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    getByKey(key: any, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams: QueryParams | string, options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @returns A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    load(options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and completely replace the cached collection with the queried entities.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence load behavior
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    loadWithQuery(queryParams: QueryParams | string, options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @returns A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity: Partial<T>, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity: T, options?: EntityActionOptions): Observable<T>;
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     */
    addAllToCache(entities: T[], options?: EntityActionOptions): void;
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     */
    addOneToCache(entity: T, options?: EntityActionOptions): void;
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     */
    addManyToCache(entities: T[], options?: EntityActionOptions): void;
    /** Clear the cached entity collection */
    clearCache(options?: EntityActionOptions): void;
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param entity The entity to remove
     */
    removeOneFromCache(entity: T, options?: EntityActionOptions): void;
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param key The primary key of the entity to remove
     */
    removeOneFromCache(key: number | string, options?: EntityActionOptions): void;
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param entity The entities to remove
     */
    removeManyFromCache(entities: T[], options?: EntityActionOptions): void;
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param keys The primary keys of the entities to remove
     */
    removeManyFromCache(keys: (number | string)[], options?: EntityActionOptions): void;
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     */
    updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     */
    updateManyInCache(entities: Partial<T>[], options?: EntityActionOptions): void;
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     */
    upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     */
    upsertManyInCache(entities: Partial<T>[], options?: EntityActionOptions): void;
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    setFilter(pattern: any): void;
    /** Set the loaded flag */
    setLoaded(isLoaded: boolean): void;
    /** Set the loading flag */
    setLoading(isLoading: boolean): void;
    /** Get key from entity (unless arg is already a key) */
    private getKey;
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    private getResponseData$;
    private setQueryEntityActionOptions;
    private setSaveEntityActionOptions;
}
