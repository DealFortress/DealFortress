import { MemoizedSelector } from '@ngrx/store';
import { Selector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCacheSelector } from './entity-cache-selector';
import { EntityCollection, ChangeStateMap } from '../reducers/entity-collection';
import { EntityCollectionCreator } from '../reducers/entity-collection-creator';
import { EntityMetadata } from '../entity-metadata/entity-metadata';
import * as i0 from "@angular/core";
/**
 * The selector functions for entity collection members,
 * Selects from the entity collection to the collection member
 * Contrast with {EntitySelectors}.
 */
export interface CollectionSelectors<T> {
    readonly [selector: string]: any;
    /** Count of entities in the cached collection. */
    readonly selectCount: Selector<EntityCollection<T>, number>;
    /** All entities in the cached collection. */
    readonly selectEntities: Selector<EntityCollection<T>, T[]>;
    /** Map of entity keys to entities */
    readonly selectEntityMap: Selector<EntityCollection<T>, Dictionary<T>>;
    /** Filter pattern applied by the entity collection's filter function */
    readonly selectFilter: Selector<EntityCollection<T>, string>;
    /** Entities in the cached collection that pass the filter function */
    readonly selectFilteredEntities: Selector<EntityCollection<T>, T[]>;
    /** Keys of the cached collection, in the collection's native sort order */
    readonly selectKeys: Selector<EntityCollection<T>, string[] | number[]>;
    /** True when the collection has been fully loaded. */
    readonly selectLoaded: Selector<EntityCollection<T>, boolean>;
    /** True when a multi-entity query command is in progress. */
    readonly selectLoading: Selector<EntityCollection<T>, boolean>;
    /** ChangeState (including original values) of entities with unsaved changes */
    readonly selectChangeState: Selector<EntityCollection<T>, ChangeStateMap<T>>;
}
/**
 * The selector functions for entity collection members,
 * Selects from store root, through EntityCache, to the entity collection member
 * Contrast with {CollectionSelectors}.
 */
export interface EntitySelectors<T> {
    /** Name of the entity collection for these selectors */
    readonly entityName: string;
    readonly [name: string]: MemoizedSelector<EntityCollection<T>, any> | string;
    /** The cached EntityCollection itself */
    readonly selectCollection: MemoizedSelector<Object, EntityCollection<T>>;
    /** Count of entities in the cached collection. */
    readonly selectCount: MemoizedSelector<Object, number>;
    /** All entities in the cached collection. */
    readonly selectEntities: MemoizedSelector<Object, T[]>;
    /** The EntityCache */
    readonly selectEntityCache: MemoizedSelector<Object, EntityCache>;
    /** Map of entity keys to entities */
    readonly selectEntityMap: MemoizedSelector<Object, Dictionary<T>>;
    /** Filter pattern applied by the entity collection's filter function */
    readonly selectFilter: MemoizedSelector<Object, string>;
    /** Entities in the cached collection that pass the filter function */
    readonly selectFilteredEntities: MemoizedSelector<Object, T[]>;
    /** Keys of the cached collection, in the collection's native sort order */
    readonly selectKeys: MemoizedSelector<Object, string[] | number[]>;
    /** True when the collection has been fully loaded. */
    readonly selectLoaded: MemoizedSelector<Object, boolean>;
    /** True when a multi-entity query command is in progress. */
    readonly selectLoading: MemoizedSelector<Object, boolean>;
    /** ChangeState (including original values) of entities with unsaved changes */
    readonly selectChangeState: MemoizedSelector<Object, ChangeStateMap<T>>;
}
/** Creates EntitySelector functions for entity collections. */
export declare class EntitySelectorsFactory {
    private entityCollectionCreator;
    private selectEntityCache;
    constructor(entityCollectionCreator?: EntityCollectionCreator, selectEntityCache?: EntityCacheSelector);
    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @param entityName the name of the collection
     */
    createCollectionSelector<T = any, C extends EntityCollection<T> = EntityCollection<T>>(entityName: string): MemoizedSelector<Object, C, (s1: EntityCache) => C>;
    /**
     * Creates entity collection selectors from metadata.
     * @param metadata - EntityMetadata for the collection.
     * May be partial but much have `entityName`.
     */
    createCollectionSelectors<T, S extends CollectionSelectors<T> = CollectionSelectors<T>>(metadata: EntityMetadata<T>): S;
    /**
     * Creates default entity collection selectors for an entity type.
     * Use the metadata overload for additional collection selectors.
     * @param entityName - name of the entity type
     */
    createCollectionSelectors<T, S extends CollectionSelectors<T> = CollectionSelectors<T>>(entityName: string): S;
    /**
     * Creates the store-rooted selectors for an entity collection.
     * {EntitySelectors$Factory} turns them into selectors$.
     *
     * @param metadata - EntityMetadata for the collection.
     * May be partial but much have `entityName`.
     *
     * Based on ngrx/entity/state_selectors.ts
     * Differs in that these selectors select from the NgRx store root,
     * through the collection, to the collection members.
     */
    create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(metadata: EntityMetadata<T>): S;
    /**
     * Creates the default store-rooted selectors for an entity collection.
     * {EntitySelectors$Factory} turns them into selectors$.
     * Use the metadata overload for additional collection selectors.
     *
     * @param entityName - name of the entity type.
     *
     * Based on ngrx/entity/state_selectors.ts
     * Differs in that these selectors select from the NgRx store root,
     * through the collection, to the collection members.
     */
    create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(entityName: string): S;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntitySelectorsFactory, [{ optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntitySelectorsFactory>;
}
