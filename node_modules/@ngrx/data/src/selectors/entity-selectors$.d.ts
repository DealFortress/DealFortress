import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { EntityAction } from '../actions/entity-action';
import { EntityCacheSelector } from './entity-cache-selector';
import { EntitySelectors } from './entity-selectors';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCollection, ChangeStateMap } from '../reducers/entity-collection';
import * as i0 from "@angular/core";
/**
 * The selector observable functions for entity collection members.
 */
export interface EntitySelectors$<T> {
    /** Name of the entity collection for these selectors$ */
    readonly entityName: string;
    /** Names from custom selectors from additionalCollectionState fits here, 'any' to avoid conflict with entityName */
    readonly [name: string]: Observable<any> | Store<any> | any;
    /** Observable of the collection as a whole */
    readonly collection$: Observable<EntityCollection> | Store<EntityCollection>;
    /** Observable of count of entities in the cached collection. */
    readonly count$: Observable<number> | Store<number>;
    /** Observable of all entities in the cached collection. */
    readonly entities$: Observable<T[]> | Store<T[]>;
    /** Observable of actions related to this entity type. */
    readonly entityActions$: Observable<EntityAction>;
    /** Observable of the map of entity keys to entities */
    readonly entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;
    /** Observable of error actions related to this entity type. */
    readonly errors$: Observable<EntityAction>;
    /** Observable of the filter pattern applied by the entity collection's filter function */
    readonly filter$: Observable<string> | Store<string>;
    /** Observable of entities in the cached collection that pass the filter function */
    readonly filteredEntities$: Observable<T[]> | Store<T[]>;
    /** Observable of the keys of the cached collection, in the collection's native sort order */
    readonly keys$: Observable<string[] | number[]> | Store<string[] | number[]>;
    /** Observable true when the collection has been loaded */
    readonly loaded$: Observable<boolean> | Store<boolean>;
    /** Observable true when a multi-entity query command is in progress. */
    readonly loading$: Observable<boolean> | Store<boolean>;
    /** ChangeState (including original values) of entities with unsaved changes */
    readonly changeState$: Observable<ChangeStateMap<T>> | Store<ChangeStateMap<T>>;
}
/** Creates observable EntitySelectors$ for entity collections. */
export declare class EntitySelectors$Factory {
    private store;
    private actions;
    private selectEntityCache;
    /** Observable of the EntityCache */
    entityCache$: Observable<EntityCache>;
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    entityActionErrors$: Observable<EntityAction>;
    constructor(store: Store<any>, actions: Actions<EntityAction>, selectEntityCache: EntityCacheSelector);
    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @param entityName - is also the name of the collection.
     * @param selectors - selector functions for this collection.
     **/
    create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(entityName: string, selectors: EntitySelectors<T>): S$;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntitySelectors$Factory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntitySelectors$Factory>;
}
