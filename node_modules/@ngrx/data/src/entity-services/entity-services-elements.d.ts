import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EntityAction } from '../actions/entity-action';
import { EntityCache } from '../reducers/entity-cache';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntitySelectors$Factory } from '../selectors/entity-selectors$';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
import * as i0 from "@angular/core";
/** Core ingredients of an EntityServices class */
export declare class EntityServicesElements {
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    readonly entityCollectionServiceFactory: EntityCollectionServiceFactory;
    /** The ngrx store, scoped to the EntityCache */
    readonly store: Store<EntityCache>;
    constructor(
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    entityCollectionServiceFactory: EntityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory: EntityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory: EntitySelectors$Factory, 
    /** The ngrx store, scoped to the EntityCache */
    store: Store<EntityCache>);
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    readonly entityActionErrors$: Observable<EntityAction>;
    /** Observable of the entire entity cache */
    readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    readonly reducedActions$: Observable<Action>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityServicesElements, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityServicesElements>;
}
