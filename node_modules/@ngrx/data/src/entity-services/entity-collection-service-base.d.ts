import { Action, Store } from '@ngrx/store';
import { Dictionary, IdSelector, Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { EntityAction, EntityActionOptions } from '../actions/entity-action';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityCollection, ChangeStateMap } from '../reducers/entity-collection';
import { EntityDispatcher } from '../dispatchers/entity-dispatcher';
import { EntityCollectionService } from './entity-collection-service';
import { EntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
import { EntityOp } from '../actions/entity-op';
import { EntitySelectors } from '../selectors/entity-selectors';
import { EntitySelectors$ } from '../selectors/entity-selectors$';
import { QueryParams } from '../dataservices/interfaces';
/**
 * Base class for a concrete EntityCollectionService<T>.
 * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
 * @param EntityCollectionServiceElements The ingredients for this service
 * as a source of supporting services for creating an EntityCollectionService<T> instance.
 */
export declare class EntityCollectionServiceBase<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>> implements EntityCollectionService<T> {
    /** Name of the entity type of this collection service */
    readonly entityName: string;
    /** Dispatcher of EntityCommands (EntityActions) */
    readonly dispatcher: EntityDispatcher<T>;
    /** All selectors of entity collection properties */
    readonly selectors: EntitySelectors<T>;
    /** All selectors$ (observables of entity collection properties) */
    readonly selectors$: S$;
    constructor(
    /** Name of the entity type of this collection service */
    entityName: string, 
    /** Creates the core elements of the EntityCollectionService for this entity type */
    serviceElementsFactory: EntityCollectionServiceElementsFactory);
    /**
     * Create an {EntityAction} for this entity type.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    createEntityAction<P = any>(op: EntityOp, data?: P, options?: EntityActionOptions): EntityAction<P>;
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
     * Dispatch an action of any type to the ngrx store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action: Action): Action;
    /** The NgRx Store for the {EntityCache} */
    get store(): Store<import("@ngrx/data").EntityCache>;
    /**
     * Utility class with methods to validate EntityAction payloads.
     */
    guard: EntityActionGuard<T>;
    /** Returns the primary key (id) of this entity */
    selectId: IdSelector<T>;
    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     */
    toUpdate: (entity: Partial<T>) => Update<T>;
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the entity
     * after server reports successful save or the save error.
     */
    add(entity: Partial<T>, options: EntityActionOptions & {
        isOptimistic: false;
    }): Observable<T>;
    add(entity: T, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     * @param [options] options such as the tag and mergeStrategy
     */
    cancel(correlationId: any, reason?: string, options?: EntityActionOptions): void;
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The entity to delete
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(entity: T, options?: EntityActionOptions): Observable<number | string>;
    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The primary key of the entity to remove
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(key: number | string, options?: EntityActionOptions): Observable<number | string>;
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @param [options] options that influence merge behavior
     * @returns Observable of the collection
     * after server reports successful query or the query error.
     * @see load()
     */
    getAll(options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param key The primary key of the entity to get.
     * @param [options] options that influence merge behavior
     * @returns Observable of the queried entity that is in the collection
     * after server reports success or the query error.
     */
    getByKey(key: any, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence merge behavior
     * @returns Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams: QueryParams | string, options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @param [options] options that influence load behavior
     * @returns Observable of the collection
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
     * @returns Observable of the queried entities
     * after server reports successful query or the query error.
     */
    loadWithQuery(queryParams: QueryParams | string, options?: EntityActionOptions): Observable<T[]>;
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity: Partial<T>, options?: EntityActionOptions): Observable<T>;
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Call only if the server supports upsert.
     * @param entity entity to add or upsert.
     * It may omit its key if an add, and is pessimistic, and the server creates the key;
     * must have a key if optimistic save.
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity: T, options?: EntityActionOptions): Observable<T>;
    /*** Cache-only operations that do not update remote storage ***/
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addAllToCache(entities: T[], options?: EntityActionOptions): void;
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param entity to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addOneToCache(entity: T, options?: EntityActionOptions): void;
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addManyToCache(entities: T[], options?: EntityActionOptions): void;
    /** Clear the cached entity collection */
    clearCache(): void;
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param entity The entity to remove
     * @param [options] options such as mergeStrategy
     */
    removeOneFromCache(entity: T, options?: EntityActionOptions): void;
    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param key The primary key of the entity to remove
     * @param [options] options such as mergeStrategy
     */
    removeOneFromCache(key: number | string, options?: EntityActionOptions): void;
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param entity The entities to remove
     * @param [options] options such as mergeStrategy
     */
    removeManyFromCache(entities: T[], options?: EntityActionOptions): void;
    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param keys The primary keys of the entities to remove
     * @param [options] options such as mergeStrategy
     */
    removeManyFromCache(keys: (number | string)[], options?: EntityActionOptions): void;
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param entities to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateManyInCache(entities: Partial<T>[], options?: EntityActionOptions): void;
    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload.
     * @param entity to upsert directly in cache.
     * @param [options] options such as mergeStrategy
     */
    upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload.
     * @param entities to upsert directly in cache.
     * @param [options] options such as mergeStrategy
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
    /** Observable of the collection as a whole */
    collection$: Observable<EntityCollection<T>> | Store<EntityCollection<T>>;
    /** Observable of count of entities in the cached collection. */
    count$: Observable<number> | Store<number>;
    /** Observable of all entities in the cached collection. */
    entities$: Observable<T[]> | Store<T[]>;
    /** Observable of actions related to this entity type. */
    entityActions$: Observable<EntityAction>;
    /** Observable of the map of entity keys to entities */
    entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;
    /** Observable of error actions related to this entity type. */
    errors$: Observable<EntityAction>;
    /** Observable of the filter pattern applied by the entity collection's filter function */
    filter$: Observable<any> | Store<any>;
    /** Observable of entities in the cached collection that pass the filter function */
    filteredEntities$: Observable<T[]> | Store<T[]>;
    /** Observable of the keys of the cached collection, in the collection's native sort order */
    keys$: Observable<string[] | number[]> | Store<string[] | number[]>;
    /** Observable true when the collection has been loaded */
    loaded$: Observable<boolean> | Store<boolean>;
    /** Observable true when a multi-entity query command is in progress. */
    loading$: Observable<boolean> | Store<boolean>;
    /** Original entity values for entities with unsaved changes */
    changeState$: Observable<ChangeStateMap<T>> | Store<ChangeStateMap<T>>;
}
