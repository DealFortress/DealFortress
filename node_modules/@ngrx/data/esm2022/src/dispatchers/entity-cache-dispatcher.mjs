import { Injectable, Inject } from '@angular/core';
import { ScannedActionsSubject } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators';
import { PersistanceCanceled } from './entity-dispatcher';
import { ClearCollections, EntityCacheAction, LoadCollections, MergeQuerySet, SetEntityCache, SaveEntities, SaveEntitiesCancel, } from '../actions/entity-cache-action';
import * as i0 from "@angular/core";
import * as i1 from "../utils/correlation-id-generator";
import * as i2 from "./entity-dispatcher-default-options";
import * as i3 from "@ngrx/store";
import * as i4 from "rxjs";
/**
 * Dispatches Entity Cache actions to the EntityCache reducer
 */
export class EntityCacheDispatcher {
    constructor(
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    scannedActions$, 
    /** The store, scoped to the EntityCache */
    store) {
        this.correlationIdGenerator = correlationIdGenerator;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.store = store;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param correlationId The correlation id for the corresponding action
     * @param [reason] explains why canceled and by whom.
     * @param [entityNames] array of entity names so can turn off loading flag for their collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    cancelSaveEntities(correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    }
    /** Clear the named entity collections in cache
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If null/undefined/no array, clear all collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    clearCollections(collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    }
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param collections The collections to load, typically the result of a query.
     * @param [tag] tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    loadCollections(collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    }
    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] tag to identify the operation from the app perspective.
     */
    mergeQuerySet(querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] tag to identify the operation from the app perspective.
     */
    setEntityCache(cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    }
    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
     * Important: only call if your server supports the SaveEntities protocol
     * through your EntityDataService.saveEntities method.
     * @param changes Either the entities to save, as an array of {ChangeSetItem}, or
     * a ChangeSet that holds such changes.
     * @param url The server url which receives the save request
     * @param [options] options such as tag, correlationId, isOptimistic, and mergeStrategy.
     * These values are defaulted if not supplied.
     * @returns A terminating Observable<ChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    saveEntities(changes, url, options) {
        const changeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        const isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        const tag = options.tag || 'Save Entities';
        options = { ...options, correlationId, isOptimistic, tag };
        const action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    getSaveEntitiesResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
            act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
            act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((act) => crid === act.payload.correlationId), take(1), mergeMap((act) => {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(act.payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(act.payload.changeSet)
                    : throwError(act.payload);
        }));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher, deps: [{ token: i1.CorrelationIdGenerator }, { token: i2.EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CorrelationIdGenerator }, { type: i2.EntityDispatcherDefaultOptions }, { type: i4.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: i3.Store }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWRpc3BhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2Rpc3BhdGNoZXJzL2VudGl0eS1jYWNoZS1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBVSxxQkFBcUIsRUFBUyxNQUFNLGFBQWEsQ0FBQztBQUVuRSxPQUFPLEVBQWMsRUFBRSxFQUFnQixVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBUXJFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzFELE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBRWpCLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLFlBQVksRUFDWixrQkFBa0IsR0FHbkIsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7O0FBRXhDOztHQUVHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQVFoQztJQUNFLDJEQUEyRDtJQUNuRCxzQkFBOEM7SUFDdEQ7OztPQUdHO0lBQ0ssd0JBQXdEO0lBQ2hFLDBFQUEwRTtJQUMzQyxlQUFtQztJQUNsRSwyQ0FBMkM7SUFDbkMsS0FBeUI7UUFUekIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUs5Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWdDO1FBSXhELFVBQUssR0FBTCxLQUFLLENBQW9CO1FBRWpDLHVGQUF1RjtRQUN2RixzREFBc0Q7UUFDdEQsd0ZBQXdGO1FBQ3hGLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTY2FubmVkQWN0aW9uc1N1YmplY3QsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9uLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1lcmdlTWFwLCBzaGFyZVJlcGxheSwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25PcHRpb25zIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zJztcblxuaW1wb3J0IHsgTWVyZ2VTdHJhdGVneSB9IGZyb20gJy4uL2FjdGlvbnMvbWVyZ2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgUGVyc2lzdGFuY2VDYW5jZWxlZCB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXInO1xuXG5pbXBvcnQgeyBDaGFuZ2VTZXQsIENoYW5nZVNldEl0ZW0gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1jYWNoZS1jaGFuZ2Utc2V0JztcbmltcG9ydCB7XG4gIENsZWFyQ29sbGVjdGlvbnMsXG4gIEVudGl0eUNhY2hlQWN0aW9uLFxuICBFbnRpdHlDYWNoZVF1ZXJ5U2V0LFxuICBMb2FkQ29sbGVjdGlvbnMsXG4gIE1lcmdlUXVlcnlTZXQsXG4gIFNldEVudGl0eUNhY2hlLFxuICBTYXZlRW50aXRpZXMsXG4gIFNhdmVFbnRpdGllc0NhbmNlbCxcbiAgU2F2ZUVudGl0aWVzRXJyb3IsXG4gIFNhdmVFbnRpdGllc1N1Y2Nlc3MsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWFjdGlvbic7XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBFbnRpdHkgQ2FjaGUgYWN0aW9ucyB0byB0aGUgRW50aXR5Q2FjaGUgcmVkdWNlclxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q2FjaGVEaXNwYXRjaGVyIHtcbiAgLyoqXG4gICAqIEFjdGlvbnMgc2Nhbm5lZCBieSB0aGUgc3RvcmUgYWZ0ZXIgaXQgcHJvY2Vzc2VkIHRoZW0gd2l0aCByZWR1Y2Vycy5cbiAgICogQSByZXBsYXkgb2JzZXJ2YWJsZSBvZiB0aGUgbW9zdCByZWNlbnQgYWN0aW9uIHJlZHVjZWQgYnkgdGhlIHN0b3JlLlxuICAgKi9cbiAgcmVkdWNlZEFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbj47XG4gIHByaXZhdGUgcmFTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogR2VuZXJhdGVzIGNvcnJlbGF0aW9uIGlkcyBmb3IgcXVlcnkgYW5kIHNhdmUgbWV0aG9kcyAqL1xuICAgIHByaXZhdGUgY29ycmVsYXRpb25JZEdlbmVyYXRvcjogQ29ycmVsYXRpb25JZEdlbmVyYXRvcixcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaGVyIG9wdGlvbnMgY29uZmlndXJlIGRpc3BhdGNoZXIgYmVoYXZpb3Igc3VjaCBhc1xuICAgICAqIHdoZXRoZXIgYWRkIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWMgYnkgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRlZmF1bHREaXNwYXRjaGVyT3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIC8qKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuICovXG4gICAgQEluamVjdChTY2FubmVkQWN0aW9uc1N1YmplY3QpIHNjYW5uZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+LFxuICAgIC8qKiBUaGUgc3RvcmUsIHNjb3BlZCB0byB0aGUgRW50aXR5Q2FjaGUgKi9cbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT5cbiAgKSB7XG4gICAgLy8gUmVwbGF5IGJlY2F1c2Ugc29tZXRpbWVzIGluIHRlc3RzIHdpbGwgZmFrZSBkYXRhIHNlcnZpY2Ugd2l0aCBzeW5jaHJvbm91cyBvYnNlcnZhYmxlXG4gICAgLy8gd2hpY2ggbWFrZXMgc3Vic2NyaWJlciBtaXNzIHRoZSBkaXNwYXRjaGVkIGFjdGlvbnMuXG4gICAgLy8gT2YgY291cnNlIHRoYXQncyBhIHRlc3RpbmcgbWlzdGFrZS4gQnV0IGVhc3kgdG8gZm9yZ2V0LCBsZWFkaW5nIHRvIHBhaW5mdWwgZGVidWdnaW5nLlxuICAgIHRoaXMucmVkdWNlZEFjdGlvbnMkID0gc2Nhbm5lZEFjdGlvbnMkLnBpcGUoc2hhcmVSZXBsYXkoMSkpO1xuICAgIC8vIFN0YXJ0IGxpc3RlbmluZyBzbyBsYXRlIHN1YnNjcmliZXIgd29uJ3QgbWlzcyB0aGUgbW9zdCByZWNlbnQgYWN0aW9uLlxuICAgIHRoaXMucmFTdWJzY3JpcHRpb24gPSB0aGlzLnJlZHVjZWRBY3Rpb25zJC5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBBY3Rpb24gdG8gdGhlIHN0b3JlLlxuICAgKiBAcGFyYW0gYWN0aW9uIHRoZSBBY3Rpb25cbiAgICogQHJldHVybnMgdGhlIGRpc3BhdGNoZWQgQWN0aW9uXG4gICAqL1xuICBkaXNwYXRjaChhY3Rpb246IEFjdGlvbik6IEFjdGlvbiB7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIGNhbmNlbCB0aGUgc2F2ZUVudGl0aWVzIHJlcXVlc3Qgd2l0aCBtYXRjaGluZyBjb3JyZWxhdGlvbiBpZC5cbiAgICogQHBhcmFtIGNvcnJlbGF0aW9uSWQgVGhlIGNvcnJlbGF0aW9uIGlkIGZvciB0aGUgY29ycmVzcG9uZGluZyBhY3Rpb25cbiAgICogQHBhcmFtIFtyZWFzb25dIGV4cGxhaW5zIHdoeSBjYW5jZWxlZCBhbmQgYnkgd2hvbS5cbiAgICogQHBhcmFtIFtlbnRpdHlOYW1lc10gYXJyYXkgb2YgZW50aXR5IG5hbWVzIHNvIGNhbiB0dXJuIG9mZiBsb2FkaW5nIGZsYWcgZm9yIHRoZWlyIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gW3RhZ10gdGFnIHRvIGlkZW50aWZ5IHRoZSBvcGVyYXRpb24gZnJvbSB0aGUgYXBwIHBlcnNwZWN0aXZlLlxuICAgKi9cbiAgY2FuY2VsU2F2ZUVudGl0aWVzKFxuICAgIGNvcnJlbGF0aW9uSWQ6IGFueSxcbiAgICByZWFzb24/OiBzdHJpbmcsXG4gICAgZW50aXR5TmFtZXM/OiBzdHJpbmdbXSxcbiAgICB0YWc/OiBzdHJpbmdcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFjb3JyZWxhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgY29ycmVsYXRpb25JZCcpO1xuICAgIH1cbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgU2F2ZUVudGl0aWVzQ2FuY2VsKFxuICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgIHJlYXNvbixcbiAgICAgIGVudGl0eU5hbWVzLFxuICAgICAgdGFnXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoKGFjdGlvbik7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIG5hbWVkIGVudGl0eSBjb2xsZWN0aW9ucyBpbiBjYWNoZVxuICAgKiBAcGFyYW0gW2NvbGxlY3Rpb25zXSBBcnJheSBvZiBuYW1lcyBvZiB0aGUgY29sbGVjdGlvbnMgdG8gY2xlYXIuXG4gICAqIElmIGVtcHR5IGFycmF5LCBkb2VzIG5vdGhpbmcuIElmIG51bGwvdW5kZWZpbmVkL25vIGFycmF5LCBjbGVhciBhbGwgY29sbGVjdGlvbnMuXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqL1xuICBjbGVhckNvbGxlY3Rpb25zKGNvbGxlY3Rpb25zPzogc3RyaW5nW10sIHRhZz86IHN0cmluZykge1xuICAgIHRoaXMuZGlzcGF0Y2gobmV3IENsZWFyQ29sbGVjdGlvbnMoY29sbGVjdGlvbnMsIHRhZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgbXVsdGlwbGUgZW50aXR5IGNvbGxlY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqIGJlZm9yZSBhbnkgc2VsZWN0b3JzJCBvYnNlcnZhYmxlcyBlbWl0LlxuICAgKiBAcGFyYW0gY29sbGVjdGlvbnMgVGhlIGNvbGxlY3Rpb25zIHRvIGxvYWQsIHR5cGljYWxseSB0aGUgcmVzdWx0IG9mIGEgcXVlcnkuXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqIGluIHRoZSBmb3JtIG9mIGEgbWFwIG9mIGVudGl0eSBjb2xsZWN0aW9ucy5cbiAgICovXG4gIGxvYWRDb2xsZWN0aW9ucyhjb2xsZWN0aW9uczogRW50aXR5Q2FjaGVRdWVyeVNldCwgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgTG9hZENvbGxlY3Rpb25zKGNvbGxlY3Rpb25zLCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgZW50aXRpZXMgZnJvbSBhIHF1ZXJ5IHJlc3VsdFxuICAgKiB0aGF0IHJldHVybmVkIGVudGl0aWVzIGZyb20gbXVsdGlwbGUgY29sbGVjdGlvbnMuXG4gICAqIENvcnJlc3BvbmRpbmcgZW50aXR5IGNhY2hlIHJlZHVjZXIgc2hvdWxkIGFkZCBhbmQgdXBkYXRlIGFsbCBjb2xsZWN0aW9uc1xuICAgKiBhdCB0aGUgc2FtZSB0aW1lLCBiZWZvcmUgYW55IHNlbGVjdG9ycyQgb2JzZXJ2YWJsZXMgZW1pdC5cbiAgICogQHBhcmFtIHF1ZXJ5U2V0IFRoZSByZXN1bHQgb2YgdGhlIHF1ZXJ5IGluIHRoZSBmb3JtIG9mIGEgbWFwIG9mIGVudGl0eSBjb2xsZWN0aW9ucy5cbiAgICogVGhlc2UgYXJlIHRoZSBlbnRpdHkgZGF0YSB0byBtZXJnZSBpbnRvIHRoZSByZXNwZWN0aXZlIGNvbGxlY3Rpb25zLlxuICAgKiBAcGFyYW0gbWVyZ2VTdHJhdGVneSBIb3cgdG8gbWVyZ2UgYSBxdWVyaWVkIGVudGl0eSB3aGVuIGl0IGlzIGFscmVhZHkgaW4gdGhlIGNvbGxlY3Rpb24uXG4gICAqIFRoZSBkZWZhdWx0IGlzIE1lcmdlU3RyYXRlZ3kuUHJlc2VydmVDaGFuZ2VzXG4gICAqIEBwYXJhbSBbdGFnXSB0YWcgdG8gaWRlbnRpZnkgdGhlIG9wZXJhdGlvbiBmcm9tIHRoZSBhcHAgcGVyc3BlY3RpdmUuXG4gICAqL1xuICBtZXJnZVF1ZXJ5U2V0KFxuICAgIHF1ZXJ5U2V0OiBFbnRpdHlDYWNoZVF1ZXJ5U2V0LFxuICAgIG1lcmdlU3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5LFxuICAgIHRhZz86IHN0cmluZ1xuICApIHtcbiAgICB0aGlzLmRpc3BhdGNoKG5ldyBNZXJnZVF1ZXJ5U2V0KHF1ZXJ5U2V0LCBtZXJnZVN0cmF0ZWd5LCB0YWcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgZW50aXR5IGNhY2hlIGFjdGlvbiBmb3IgcmVwbGFjaW5nIHRoZSBlbnRpcmUgZW50aXR5IGNhY2hlLlxuICAgKiBEYW5nZXJvdXMgYmVjYXVzZSBicnV0ZSBmb3JjZSBidXQgdXNlZnVsIGFzIHdoZW4gcmUtaHlkcmF0aW5nIGFuIEVudGl0eUNhY2hlXG4gICAqIGZyb20gbG9jYWwgYnJvd3NlciBzdG9yYWdlIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGxhdW5jaGVzLlxuICAgKiBAcGFyYW0gY2FjaGUgTmV3IHN0YXRlIG9mIHRoZSBlbnRpdHkgY2FjaGVcbiAgICogQHBhcmFtIFt0YWddIHRhZyB0byBpZGVudGlmeSB0aGUgb3BlcmF0aW9uIGZyb20gdGhlIGFwcCBwZXJzcGVjdGl2ZS5cbiAgICovXG4gIHNldEVudGl0eUNhY2hlKGNhY2hlOiBFbnRpdHlDYWNoZSwgdGFnPzogc3RyaW5nKSB7XG4gICAgdGhpcy5kaXNwYXRjaChuZXcgU2V0RW50aXR5Q2FjaGUoY2FjaGUsIHRhZykpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFjdGlvbiB0byBzYXZlIG11bHRpcGxlIGVudGl0eSBjaGFuZ2VzIHRvIHJlbW90ZSBzdG9yYWdlLlxuICAgKiBSZWxpZXMgb24gYW4gTmdyeCBFZmZlY3Qgc3VjaCBhcyBFbnRpdHlFZmZlY3RzLnNhdmVFbnRpdGllcyQuXG4gICAqIEltcG9ydGFudDogb25seSBjYWxsIGlmIHlvdXIgc2VydmVyIHN1cHBvcnRzIHRoZSBTYXZlRW50aXRpZXMgcHJvdG9jb2xcbiAgICogdGhyb3VnaCB5b3VyIEVudGl0eURhdGFTZXJ2aWNlLnNhdmVFbnRpdGllcyBtZXRob2QuXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEVpdGhlciB0aGUgZW50aXRpZXMgdG8gc2F2ZSwgYXMgYW4gYXJyYXkgb2Yge0NoYW5nZVNldEl0ZW19LCBvclxuICAgKiBhIENoYW5nZVNldCB0aGF0IGhvbGRzIHN1Y2ggY2hhbmdlcy5cbiAgICogQHBhcmFtIHVybCBUaGUgc2VydmVyIHVybCB3aGljaCByZWNlaXZlcyB0aGUgc2F2ZSByZXF1ZXN0XG4gICAqIEBwYXJhbSBbb3B0aW9uc10gb3B0aW9ucyBzdWNoIGFzIHRhZywgY29ycmVsYXRpb25JZCwgaXNPcHRpbWlzdGljLCBhbmQgbWVyZ2VTdHJhdGVneS5cbiAgICogVGhlc2UgdmFsdWVzIGFyZSBkZWZhdWx0ZWQgaWYgbm90IHN1cHBsaWVkLlxuICAgKiBAcmV0dXJucyBBIHRlcm1pbmF0aW5nIE9ic2VydmFibGU8Q2hhbmdlU2V0PiB3aXRoIGRhdGEgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyXG4gICAqIGFmdGVyIHNlcnZlciByZXBvcnRzIHN1Y2Nlc3NmdWwgc2F2ZSBPUiB0aGUgc2F2ZSBlcnJvci5cbiAgICogVE9ETzogc2hvdWxkIHJldHVybiB0aGUgbWF0Y2hpbmcgZW50aXRpZXMgZnJvbSBjYWNoZSByYXRoZXIgdGhhbiB0aGUgcmF3IHNlcnZlciBkYXRhLlxuICAgKi9cbiAgc2F2ZUVudGl0aWVzKFxuICAgIGNoYW5nZXM6IENoYW5nZVNldEl0ZW1bXSB8IENoYW5nZVNldCxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zPzogRW50aXR5QWN0aW9uT3B0aW9uc1xuICApOiBPYnNlcnZhYmxlPENoYW5nZVNldD4ge1xuICAgIGNvbnN0IGNoYW5nZVNldCA9IEFycmF5LmlzQXJyYXkoY2hhbmdlcykgPyB7IGNoYW5nZXMgfSA6IGNoYW5nZXM7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3QgY29ycmVsYXRpb25JZCA9XG4gICAgICBvcHRpb25zLmNvcnJlbGF0aW9uSWQgPT0gbnVsbFxuICAgICAgICA/IHRoaXMuY29ycmVsYXRpb25JZEdlbmVyYXRvci5uZXh0KClcbiAgICAgICAgOiBvcHRpb25zLmNvcnJlbGF0aW9uSWQ7XG4gICAgY29uc3QgaXNPcHRpbWlzdGljID1cbiAgICAgIG9wdGlvbnMuaXNPcHRpbWlzdGljID09IG51bGxcbiAgICAgICAgPyB0aGlzLmRlZmF1bHREaXNwYXRjaGVyT3B0aW9ucy5vcHRpbWlzdGljU2F2ZUVudGl0aWVzIHx8IGZhbHNlXG4gICAgICAgIDogb3B0aW9ucy5pc09wdGltaXN0aWMgPT09IHRydWU7XG4gICAgY29uc3QgdGFnID0gb3B0aW9ucy50YWcgfHwgJ1NhdmUgRW50aXRpZXMnO1xuICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGNvcnJlbGF0aW9uSWQsIGlzT3B0aW1pc3RpYywgdGFnIH07XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFNhdmVFbnRpdGllcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kaXNwYXRjaChhY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLmdldFNhdmVFbnRpdGllc1Jlc3BvbnNlRGF0YSQob3B0aW9ucy5jb3JyZWxhdGlvbklkKS5waXBlKFxuICAgICAgc2hhcmVSZXBsYXkoMSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBPYnNlcnZhYmxlIG9mIGRhdGEgZnJvbSB0aGUgc2VydmVyLXN1Y2Nlc3MgU2F2ZUVudGl0aWVzIGFjdGlvbiB3aXRoXG4gICAqIHRoZSBnaXZlbiBDb3JyZWxhdGlvbiBJZCwgYWZ0ZXIgdGhhdCBhY3Rpb24gd2FzIHByb2Nlc3NlZCBieSB0aGUgbmdyeCBzdG9yZS5cbiAgICogb3IgZWxzZSBwdXQgdGhlIHNlcnZlciBlcnJvciBvbiB0aGUgT2JzZXJ2YWJsZSBlcnJvciBjaGFubmVsLlxuICAgKiBAcGFyYW0gY3JpZCBUaGUgY29ycmVsYXRpb25JZCBmb3IgYm90aCB0aGUgc2F2ZSBhbmQgcmVzcG9uc2UgYWN0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgZ2V0U2F2ZUVudGl0aWVzUmVzcG9uc2VEYXRhJChjcmlkOiBhbnkpOiBPYnNlcnZhYmxlPENoYW5nZVNldD4ge1xuICAgIC8qKlxuICAgICAqIHJlZHVjZWRBY3Rpb25zJCBtdXN0IGJlIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAgICogYmVjYXVzZSB0aGUgcmVzcG9uc2UgYWN0aW9uIG1pZ2h0IGhhdmUgYmVlbiBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZVxuICAgICAqIGJlZm9yZSBjYWxsZXIgaGFkIGEgY2hhbmNlIHRvIHN1YnNjcmliZS5cbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5yZWR1Y2VkQWN0aW9ucyQucGlwZShcbiAgICAgIGZpbHRlcihcbiAgICAgICAgKGFjdDogQWN0aW9uKSA9PlxuICAgICAgICAgIGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1MgfHxcbiAgICAgICAgICBhY3QudHlwZSA9PT0gRW50aXR5Q2FjaGVBY3Rpb24uU0FWRV9FTlRJVElFU19FUlJPUiB8fFxuICAgICAgICAgIGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTFxuICAgICAgKSxcbiAgICAgIGZpbHRlcigoYWN0OiBBY3Rpb24pID0+IGNyaWQgPT09IChhY3QgYXMgYW55KS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgdGFrZSgxKSxcbiAgICAgIG1lcmdlTWFwKChhY3QpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX0NBTkNFTFxuICAgICAgICAgID8gdGhyb3dFcnJvcihcbiAgICAgICAgICAgICAgbmV3IFBlcnNpc3RhbmNlQ2FuY2VsZWQoXG4gICAgICAgICAgICAgICAgKGFjdCBhcyBTYXZlRW50aXRpZXNDYW5jZWwpLnBheWxvYWQucmVhc29uXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IGFjdC50eXBlID09PSBFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTX1NVQ0NFU1NcbiAgICAgICAgICA/IG9mKChhY3QgYXMgU2F2ZUVudGl0aWVzU3VjY2VzcykucGF5bG9hZC5jaGFuZ2VTZXQpXG4gICAgICAgICAgOiB0aHJvd0Vycm9yKChhY3QgYXMgU2F2ZUVudGl0aWVzRXJyb3IpLnBheWxvYWQpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=