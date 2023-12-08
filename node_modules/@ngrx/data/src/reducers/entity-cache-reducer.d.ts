import { Action, ActionReducer } from '@ngrx/store';
import { EntityCache } from './entity-cache';
import { ClearCollections, LoadCollections, MergeQuerySet, SaveEntities, SaveEntitiesCancel, SaveEntitiesError, SaveEntitiesSuccess } from '../actions/entity-cache-action';
import { EntityCollectionCreator } from './entity-collection-creator';
import { EntityCollectionReducerRegistry } from './entity-collection-reducer-registry';
import { Logger } from '../utils/interfaces';
import * as i0 from "@angular/core";
/**
 * Creates the EntityCacheReducer via its create() method
 */
export declare class EntityCacheReducerFactory {
    private entityCollectionCreator;
    private entityCollectionReducerRegistry;
    private logger;
    constructor(entityCollectionCreator: EntityCollectionCreator, entityCollectionReducerRegistry: EntityCollectionReducerRegistry, logger: Logger);
    /**
     * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    create(): ActionReducer<EntityCache, Action>;
    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    protected clearCollectionsReducer(entityCache: EntityCache, action: ClearCollections): EntityCache;
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    protected loadCollectionsReducer(entityCache: EntityCache, action: LoadCollections): EntityCache;
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    protected mergeQuerySetReducer(entityCache: EntityCache, action: MergeQuerySet): EntityCache;
    protected saveEntitiesReducer(entityCache: EntityCache, action: SaveEntities): EntityCache;
    protected saveEntitiesCancelReducer(entityCache: EntityCache, action: SaveEntitiesCancel): EntityCache;
    protected saveEntitiesErrorReducer(entityCache: EntityCache, action: SaveEntitiesError): EntityCache;
    protected saveEntitiesSuccessReducer(entityCache: EntityCache, action: SaveEntitiesSuccess): EntityCache;
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    private applyCollectionReducer;
    /** Ensure loading is false for every collection in entityNames */
    private clearLoadingFlags;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCacheReducerFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCacheReducerFactory>;
}
