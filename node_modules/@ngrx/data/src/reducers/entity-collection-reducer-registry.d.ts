import { MetaReducer } from '@ngrx/store';
import { EntityAction } from '../actions/entity-action';
import { EntityCollection } from './entity-collection';
import { EntityCollectionReducer, EntityCollectionReducerFactory } from './entity-collection-reducer';
import * as i0 from "@angular/core";
/** A hash of EntityCollectionReducers */
export interface EntityCollectionReducers {
    [entity: string]: EntityCollectionReducer<any>;
}
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
export declare class EntityCollectionReducerRegistry {
    private entityCollectionReducerFactory;
    protected entityCollectionReducers: EntityCollectionReducers;
    private entityCollectionMetaReducer;
    constructor(entityCollectionReducerFactory: EntityCollectionReducerFactory, entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[]);
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @param entityName Name of the entity type for this reducer
     */
    getOrCreateReducer<T>(entityName: string): EntityCollectionReducer<T>;
    /**
     * Register an EntityCollectionReducer for an entity type
     * @param entityName - the name of the entity type
     * @param reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     */
    registerReducer<T>(entityName: string, reducer: EntityCollectionReducer<T>): EntityCollectionReducer<T>;
    /**
     * Register a batch of EntityCollectionReducers.
     * @param reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     */
    registerReducers(reducers: EntityCollectionReducers): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCollectionReducerRegistry, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCollectionReducerRegistry>;
}
