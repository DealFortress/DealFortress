import { Injectable, Optional } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { ChangeSetOperation, excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import * as i0 from "@angular/core";
import * as i1 from "../entity-metadata/entity-definition.service";
import * as i2 from "@angular/common/http";
import * as i3 from "./default-data-service-config";
const updateOp = ChangeSetOperation.Update;
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
export class EntityCacheDataService {
    constructor(entityDefinitionService, http, config) {
        this.entityDefinitionService = entityDefinitionService;
        this.http = http;
        this.idSelectors = {};
        this.saveDelay = 0;
        this.timeout = 0;
        const { saveDelay = 0, timeout: to = 0 } = config || {};
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
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
    saveEntities(changeSet, url) {
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        let result$ = this.http
            .post(url, changeSet)
            .pipe(map((result) => this.restoreUpdates(result)), catchError(this.handleError({ method: 'POST', url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    }
    // #region helpers
    handleError(reqData) {
        return (err) => {
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    }
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    filterChangeSet(changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    }
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    flattenUpdates(changeSet) {
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return {
                    ...item,
                    entities: item.entities.map((u) => u.changes),
                };
            }
            else {
                return item;
            }
        });
        return hasMutated ? { ...changeSet, changes } : changeSet;
    }
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    restoreUpdates(changeSet) {
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                const selectId = this.getIdSelector(item.entityName);
                return {
                    ...item,
                    entities: item.entities.map((u) => ({
                        id: selectId(u),
                        changes: u,
                    })),
                };
            }
            else {
                return item;
            }
        });
        return hasMutated ? { ...changeSet, changes } : changeSet;
    }
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    getIdSelector(entityName) {
        let idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector =
                this.entityDefinitionService.getDefinition(entityName).selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService, deps: [{ token: i1.EntityDefinitionService }, { token: i2.HttpClient }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityDefinitionService }, { type: i2.HttpClient }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1jYWNoZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHckQsT0FBTyxFQUFjLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUNMLGtCQUFrQixFQUlsQiwwQkFBMEIsR0FDM0IsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7QUFLeEQsTUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0FBRTNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxzQkFBc0I7SUFLakMsWUFDWSx1QkFBZ0QsRUFDaEQsSUFBZ0IsRUFDZCxNQUFpQztRQUZuQyw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELFNBQUksR0FBSixJQUFJLENBQVk7UUFObEIsZ0JBQVcsR0FBOEMsRUFBRSxDQUFDO1FBQzVELGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBT3BCLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FV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VUFBVTs7MEJBU04sUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgbWFwLCB0aW1lb3V0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJZFNlbGVjdG9yIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHtcbiAgQ2hhbmdlU2V0T3BlcmF0aW9uLFxuICBDaGFuZ2VTZXQsXG4gIENoYW5nZVNldEl0ZW0sXG4gIENoYW5nZVNldFVwZGF0ZSxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2VFcnJvciB9IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUNvbmZpZyB9IGZyb20gJy4vZGVmYXVsdC1kYXRhLXNlcnZpY2UtY29uZmlnJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVxdWVzdERhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1cGRhdGVPcCA9IENoYW5nZVNldE9wZXJhdGlvbi5VcGRhdGU7XG5cbi8qKlxuICogRGVmYXVsdCBkYXRhIHNlcnZpY2UgZm9yIG1ha2luZyByZW1vdGUgc2VydmljZSBjYWxscyB0YXJnZXRpbmcgdGhlIGVudGlyZSBFbnRpdHlDYWNoZS5cbiAqIFNlZSBFbnRpdHlEYXRhU2VydmljZSBmb3Igc2VydmljZXMgdGhhdCB0YXJnZXQgYSBzaW5nbGUgRW50aXR5Q29sbGVjdGlvblxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVEYXRhU2VydmljZSB7XG4gIHByb3RlY3RlZCBpZFNlbGVjdG9yczogeyBbZW50aXR5TmFtZTogc3RyaW5nXTogSWRTZWxlY3Rvcjxhbnk+IH0gPSB7fTtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZz86IERlZmF1bHREYXRhU2VydmljZUNvbmZpZ1xuICApIHtcbiAgICBjb25zdCB7IHNhdmVEZWxheSA9IDAsIHRpbWVvdXQ6IHRvID0gMCB9ID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuc2F2ZURlbGF5ID0gc2F2ZURlbGF5O1xuICAgIHRoaXMudGltZW91dCA9IHRvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgY2hhbmdlcyB0byBtdWx0aXBsZSBlbnRpdGllcyBhY3Jvc3Mgb25lIG9yIG1vcmUgZW50aXR5IGNvbGxlY3Rpb25zLlxuICAgKiBTZXJ2ZXIgZW5kcG9pbnQgbXVzdCB1bmRlcnN0YW5kIHRoZSBlc3NlbnRpYWwgU2F2ZUVudGl0aWVzIHByb3RvY29sLFxuICAgKiBpbiBwYXJ0aWN1bGFyIHRoZSBDaGFuZ2VTZXQgaW50ZXJmYWNlIChleGNlcHQgZm9yIFVwZGF0ZTxUPikuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXh0cmFjdHMgdGhlIGVudGl0eSBjaGFuZ2VzIGZyb20gYSBDaGFuZ2VTZXQgVXBkYXRlPFQ+W10gYW5kIHNlbmRzIHRob3NlLlxuICAgKiBJdCB0aGVuIHJlY29uc3RydWN0cyBVcGRhdGU8VD5bXSBpbiB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSByZXN1bHQuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgIEFuIGFycmF5IG9mIFNhdmVFbnRpdHlJdGVtcy5cbiAgICogRWFjaCBTYXZlRW50aXR5SXRlbSBkZXNjcmliZSBhIGNoYW5nZSBvcGVyYXRpb24gZm9yIG9uZSBvciBtb3JlIGVudGl0aWVzIG9mIGEgc2luZ2xlIGNvbGxlY3Rpb24sXG4gICAqIGtub3duIGJ5IGl0cyAnZW50aXR5TmFtZScuXG4gICAqIEBwYXJhbSB1cmwgVGhlIHNlcnZlciBlbmRwb2ludCB0aGF0IHJlY2VpdmVzIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIHNhdmVFbnRpdGllcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCwgdXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPENoYW5nZVNldD4ge1xuICAgIGNoYW5nZVNldCA9IHRoaXMuZmlsdGVyQ2hhbmdlU2V0KGNoYW5nZVNldCk7XG4gICAgLy8gQXNzdW1lIHNlcnZlciBkb2Vzbid0IHVuZGVyc3RhbmQgQG5ncngvZW50aXR5IFVwZGF0ZTxUPiBzdHJ1Y3R1cmU7XG4gICAgLy8gRXh0cmFjdCB0aGUgZW50aXR5IGNoYW5nZXMgZnJvbSB0aGUgVXBkYXRlPFQ+W10gYW5kIHJlc3RvcmUgb24gdGhlIHJldHVybiBmcm9tIHNlcnZlclxuICAgIGNoYW5nZVNldCA9IHRoaXMuZmxhdHRlblVwZGF0ZXMoY2hhbmdlU2V0KTtcblxuICAgIGxldCByZXN1bHQkOiBPYnNlcnZhYmxlPENoYW5nZVNldD4gPSB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PENoYW5nZVNldD4odXJsLCBjaGFuZ2VTZXQpXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChyZXN1bHQpID0+IHRoaXMucmVzdG9yZVVwZGF0ZXMocmVzdWx0KSksXG4gICAgICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcih7IG1ldGhvZDogJ1BPU1QnLCB1cmwsIGRhdGE6IGNoYW5nZVNldCB9KSlcbiAgICAgICk7XG5cbiAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKHRpbWVvdXQodGhpcy50aW1lb3V0KSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdCQ7XG4gIH1cblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRGF0YVNlcnZpY2VFcnJvcihlcnIsIHJlcURhdGEpO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVyIGNoYW5nZVNldCB0byByZW1vdmUgdW53YW50ZWQgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIFRoaXMgaW1wbGVtZW50YXRpb24gZXhjbHVkZXMgbnVsbCBhbmQgZW1wdHkgQ2hhbmdlU2V0SXRlbXMuXG4gICAqIEBwYXJhbSBjaGFuZ2VTZXQgQ2hhbmdlU2V0IHdpdGggY2hhbmdlcyB0byBmaWx0ZXJcbiAgICovXG4gIHByb3RlY3RlZCBmaWx0ZXJDaGFuZ2VTZXQoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIHJldHVybiBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhjaGFuZ2VTZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIGVudGl0aWVzIGluIHVwZGF0ZSBjaGFuZ2VzIGZyb20gQG5ncnggVXBkYXRlPFQ+IHN0cnVjdHVyZSB0byBqdXN0IFQuXG4gICAqIFJldmVyc2Ugb2YgcmVzdG9yZVVwZGF0ZXMoKS5cbiAgICovXG4gIHByb3RlY3RlZCBmbGF0dGVuVXBkYXRlcyhjaGFuZ2VTZXQ6IENoYW5nZVNldCk6IENoYW5nZVNldCB7XG4gICAgbGV0IGNoYW5nZXMgPSBjaGFuZ2VTZXQuY2hhbmdlcztcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBoYXNNdXRhdGVkID0gZmFsc2U7XG4gICAgY2hhbmdlcyA9IGNoYW5nZXMubWFwKChpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbS5vcCA9PT0gdXBkYXRlT3AgJiYgaXRlbS5lbnRpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGhhc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgZW50aXRpZXM6IChpdGVtIGFzIENoYW5nZVNldFVwZGF0ZSkuZW50aXRpZXMubWFwKCh1KSA9PiB1LmNoYW5nZXMpLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgfSkgYXMgQ2hhbmdlU2V0SXRlbVtdO1xuICAgIHJldHVybiBoYXNNdXRhdGVkID8geyAuLi5jaGFuZ2VTZXQsIGNoYW5nZXMgfSA6IGNoYW5nZVNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBmbGF0dGVuZWQgVCBlbnRpdGllcyBpbiB1cGRhdGUgY2hhbmdlcyBiYWNrIHRvIEBuZ3J4IFVwZGF0ZTxUPiBzdHJ1Y3R1cmVzLlxuICAgKiBSZXZlcnNlIG9mIGZsYXR0ZW5VcGRhdGVzKCkuXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVzdG9yZVVwZGF0ZXMoY2hhbmdlU2V0OiBDaGFuZ2VTZXQpOiBDaGFuZ2VTZXQge1xuICAgIGlmIChjaGFuZ2VTZXQgPT0gbnVsbCkge1xuICAgICAgLy8gTm90aGluZz8gU2VydmVyIHByb2JhYmx5IHJlc3BvbmRlZCB3aXRoIDIwNCAtIE5vIENvbnRlbnQgYmVjYXVzZSBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkIG9yIHVwZGF0ZWQgZW50aXRpZXNcbiAgICAgIHJldHVybiBjaGFuZ2VTZXQ7XG4gICAgfVxuICAgIGxldCBjaGFuZ2VzID0gY2hhbmdlU2V0LmNoYW5nZXM7XG4gICAgaWYgKGNoYW5nZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY2hhbmdlU2V0O1xuICAgIH1cbiAgICBsZXQgaGFzTXV0YXRlZCA9IGZhbHNlO1xuICAgIGNoYW5nZXMgPSBjaGFuZ2VzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ub3AgPT09IHVwZGF0ZU9wKSB7XG4gICAgICAgIC8vIFRoZXNlIGFyZSBlbnRpdGllcywgbm90IFVwZGF0ZXM7IGNvbnZlcnQgYmFjayB0byBVcGRhdGVzXG4gICAgICAgIGhhc011dGF0ZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBzZWxlY3RJZCA9IHRoaXMuZ2V0SWRTZWxlY3RvcihpdGVtLmVudGl0eU5hbWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgZW50aXRpZXM6IGl0ZW0uZW50aXRpZXMubWFwKCh1OiBhbnkpID0+ICh7XG4gICAgICAgICAgICBpZDogc2VsZWN0SWQodSksXG4gICAgICAgICAgICBjaGFuZ2VzOiB1LFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSBhcyBDaGFuZ2VTZXRVcGRhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICB9KSBhcyBDaGFuZ2VTZXRJdGVtW107XG4gICAgcmV0dXJuIGhhc011dGF0ZWQgPyB7IC4uLmNoYW5nZVNldCwgY2hhbmdlcyB9IDogY2hhbmdlU2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaWQgKHByaW1hcnkga2V5KSBzZWxlY3RvciBmdW5jdGlvbiBmb3IgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBnZXRJZFNlbGVjdG9yKGVudGl0eU5hbWU6IHN0cmluZykge1xuICAgIGxldCBpZFNlbGVjdG9yID0gdGhpcy5pZFNlbGVjdG9yc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIWlkU2VsZWN0b3IpIHtcbiAgICAgIGlkU2VsZWN0b3IgPVxuICAgICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb24oZW50aXR5TmFtZSkuc2VsZWN0SWQ7XG4gICAgICB0aGlzLmlkU2VsZWN0b3JzW2VudGl0eU5hbWVdID0gaWRTZWxlY3RvcjtcbiAgICB9XG4gICAgcmV0dXJuIGlkU2VsZWN0b3I7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvbiBoZWxwZXJzXG59XG4iXX0=