import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdSelector } from '@ngrx/entity';
import { ChangeSet } from '../actions/entity-cache-change-set';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { RequestData } from './interfaces';
import * as i0 from "@angular/core";
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
export declare class EntityCacheDataService {
    protected entityDefinitionService: EntityDefinitionService;
    protected http: HttpClient;
    protected idSelectors: {
        [entityName: string]: IdSelector<any>;
    };
    protected saveDelay: number;
    protected timeout: number;
    constructor(entityDefinitionService: EntityDefinitionService, http: HttpClient, config?: DefaultDataServiceConfig);
    /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential SaveEntities protocol,
     * in particular the ChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param url The server endpoint that receives this request.
     */
    saveEntities(changeSet: ChangeSet, url: string): Observable<ChangeSet>;
    protected handleError(reqData: RequestData): (err: any) => Observable<never>;
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    protected filterChangeSet(changeSet: ChangeSet): ChangeSet;
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    protected flattenUpdates(changeSet: ChangeSet): ChangeSet;
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    protected restoreUpdates(changeSet: ChangeSet): ChangeSet;
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    protected getIdSelector(entityName: string): IdSelector<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCacheDataService, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCacheDataService>;
}
