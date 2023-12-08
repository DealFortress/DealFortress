import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EntityAction } from '../actions/entity-action';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCollectionService } from './entity-collection-service';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
import { EntityCollectionServiceMap, EntityServices } from './entity-services';
import { EntitySelectors$ } from '../selectors/entity-selectors$';
import { EntityServicesElements } from './entity-services-elements';
import * as i0 from "@angular/core";
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @usageNotes
 * ```ts
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 * ```
 */
export declare class EntityServicesBase implements EntityServices {
    private entityServicesElements;
    constructor(entityServicesElements: EntityServicesElements);
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    get entityActionErrors$(): Observable<EntityAction>;
    /** Observable of the entire entity cache */
    get entityCache$(): Observable<EntityCache> | Store<EntityCache>;
    /** Factory to create a default instance of an EntityCollectionService */
    get entityCollectionServiceFactory(): EntityCollectionServiceFactory;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    get reducedActions$(): Observable<Action>;
    /** The ngrx store, scoped to the EntityCache */
    protected get store(): Store<EntityCache>;
    /** Dispatch any action to the store */
    dispatch(action: Action): void;
    /** Registry of EntityCollectionService instances */
    private readonly EntityCollectionServices;
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    protected createEntityCollectionService<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(entityName: string): EntityCollectionService<T>;
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    getEntityCollectionService<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(entityName: string): EntityCollectionService<T>;
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    registerEntityCollectionService<T>(service: EntityCollectionService<T>, serviceName?: string): void;
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    registerEntityCollectionServices(entityCollectionServices: EntityCollectionServiceMap | EntityCollectionService<any>[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityServicesBase, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityServicesBase>;
}
