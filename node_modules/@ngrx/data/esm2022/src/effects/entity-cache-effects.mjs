import { Inject, Injectable, Optional } from '@angular/core';
import { ofType, createEffect } from '@ngrx/effects';
import { asyncScheduler, of, merge, race, } from 'rxjs';
import { concatMap, catchError, delay, filter, map, mergeMap, } from 'rxjs/operators';
import { DataServiceError } from '../dataservices/data-service-error';
import { excludeEmptyChangeSetItems, } from '../actions/entity-cache-change-set';
import { EntityOp } from '../actions/entity-op';
import { EntityCacheAction, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, } from '../actions/entity-cache-action';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "../dataservices/entity-cache-data.service";
import * as i3 from "../actions/entity-action-factory";
import * as i4 from "../utils/interfaces";
export class EntityCacheEffects {
    constructor(actions, dataService, entityActionFactory, logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((a) => a.payload.correlationId != null)), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((action) => this.saveEntities(action))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action) {
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.saveEntitiesCancel$.pipe(filter((a) => correlationId === a.payload.correlationId), map((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        };
    }
    /** return handler of the ChangeSet result of successful saveEntities() */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };
        return (changeSet) => {
            // DataService returned a ChangeSet with possible updates to the saved entities
            if (changeSet) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // No ChangeSet = Server probably responded '204 - No Content' because
            // it made no changes to the inserted/updated entities.
            // Respond with success action best on the ChangeSet in the request.
            changeSet = action.payload.changeSet;
            // If pessimistic save, return success action with the original ChangeSet
            if (!action.payload.isOptimistic) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // If optimistic save, avoid cache grinding by just turning off the loading flags
            // for all collections in the original ChangeSet
            const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc, []);
            return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects, deps: [{ token: i1.Actions }, { token: i2.EntityCacheDataService }, { token: i3.EntityActionFactory }, { token: i4.Logger }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Actions }, { type: i2.EntityCacheDataService }, { type: i3.EntityActionFactory }, { type: i4.Logger }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNhY2hlLWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWNhY2hlLWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBVyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFDTCxjQUFjLEVBRWQsRUFBRSxFQUNGLEtBQUssRUFDTCxJQUFJLEdBRUwsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLEdBQUcsRUFDSCxRQUFRLEdBQ1QsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBRUwsMEJBQTBCLEdBQzNCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWhELE9BQU8sRUFDTCxpQkFBaUIsRUFHakIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4QyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7Ozs7O0FBSXRFLE1BQU0sT0FBTyxrQkFBa0I7SUFLN0IsWUFDVSxPQUFnQixFQUNoQixXQUFtQyxFQUNuQyxtQkFBd0MsRUFDeEMsTUFBYztJQUN0Qjs7OztPQUlHO0lBR0ssU0FBd0I7UUFYeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0I7UUFDbkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4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RTtZQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSxDQUFDLElBQUksbUJBQW1CLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBRUQsaUZBQWlGO1lBQ2pGLGdEQUFnRDtZQUNoRCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FDMUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDWixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxHQUFHLEVBQ1QsRUFBYyxDQUNmLENBQUM7WUFDRixPQUFPLEtBQUssQ0FDVixXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FDdkIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUM5RCxDQUNGLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDO2lJQXBKVSxrQkFBa0Isd0lBZ0JuQix3QkFBd0I7cUlBaEJ2QixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVU7OzBCQWdCTixRQUFROzswQkFDUixNQUFNOzJCQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIG9mVHlwZSwgY3JlYXRlRWZmZWN0IH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jU2NoZWR1bGVyLFxuICBPYnNlcnZhYmxlLFxuICBvZixcbiAgbWVyZ2UsXG4gIHJhY2UsXG4gIFNjaGVkdWxlckxpa2UsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY29uY2F0TWFwLFxuICBjYXRjaEVycm9yLFxuICBkZWxheSxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIG1lcmdlTWFwLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7XG4gIENoYW5nZVNldCxcbiAgZXhjbHVkZUVtcHR5Q2hhbmdlU2V0SXRlbXMsXG59IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWNhY2hlLWNoYW5nZS1zZXQnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eU9wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuXG5pbXBvcnQge1xuICBFbnRpdHlDYWNoZUFjdGlvbixcbiAgU2F2ZUVudGl0aWVzLFxuICBTYXZlRW50aXRpZXNDYW5jZWwsXG4gIFNhdmVFbnRpdGllc0NhbmNlbGVkLFxuICBTYXZlRW50aXRpZXNFcnJvcixcbiAgU2F2ZUVudGl0aWVzU3VjY2Vzcyxcbn0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktY2FjaGUtYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhc2VydmljZXMvZW50aXR5LWNhY2hlLWRhdGEuc2VydmljZSc7XG5pbXBvcnQgeyBFTlRJVFlfRUZGRUNUU19TQ0hFRFVMRVIgfSBmcm9tICcuL2VudGl0eS1lZmZlY3RzLXNjaGVkdWxlcic7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eUNhY2hlRWZmZWN0cyB7XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvYmxvYi9tYXN0ZXIvZG9jL21hcmJsZS10ZXN0aW5nLm1kXG4gIC8qKiBEZWxheSBmb3IgZXJyb3IgYW5kIHNraXAgb2JzZXJ2YWJsZXMuIE11c3QgYmUgbXVsdGlwbGUgb2YgMTAgZm9yIG1hcmJsZSB0ZXN0aW5nLiAqL1xuICBwcml2YXRlIHJlc3BvbnNlRGVsYXkgPSAxMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGFjdGlvbnM6IEFjdGlvbnMsXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogRW50aXR5Q2FjaGVEYXRhU2VydmljZSxcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIE9ic2VydmFibGUgb2YgU0FWRV9FTlRJVElFU19DQU5DRUwgYWN0aW9ucyB3aXRoIG5vbi1udWxsIGNvcnJlbGF0aW9uIGlkc1xuICAgKi9cbiAgc2F2ZUVudGl0aWVzQ2FuY2VsJDogT2JzZXJ2YWJsZTxTYXZlRW50aXRpZXNDYW5jZWw+ID0gY3JlYXRlRWZmZWN0KFxuICAgICgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgICAgb2ZUeXBlKEVudGl0eUNhY2hlQWN0aW9uLlNBVkVfRU5USVRJRVNfQ0FOQ0VMKSxcbiAgICAgICAgZmlsdGVyKChhOiBTYXZlRW50aXRpZXNDYW5jZWwpID0+IGEucGF5bG9hZC5jb3JyZWxhdGlvbklkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBDb25jdXJyZW50IHBlcnNpc3RlbmNlIHJlcXVlc3RzIGNvbnNpZGVyZWQgdW5zYWZlLlxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBzYXZlRW50aXRpZXMkOiBPYnNlcnZhYmxlPEFjdGlvbj4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMucGlwZShcbiAgICAgIG9mVHlwZShFbnRpdHlDYWNoZUFjdGlvbi5TQVZFX0VOVElUSUVTKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb246IFNhdmVFbnRpdGllcykgPT4gdGhpcy5zYXZlRW50aXRpZXMoYWN0aW9uKSlcbiAgICApXG4gICk7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBTYXZlRW50aXRpZXMgYWN0aW9ucyBhbmQgcmV0dXJuIGEgc2NhbGFyIE9ic2VydmFibGU8QWN0aW9uPlxuICAgKiB0aGF0IHRoZSBlZmZlY3Qgc2hvdWxkIGRpc3BhdGNoIHRvIHRoZSBzdG9yZSBhZnRlciB0aGUgc2VydmVyIHJlc3BvbmRzLlxuICAgKiBAcGFyYW0gYWN0aW9uIFRoZSBTYXZlRW50aXRpZXMgYWN0aW9uXG4gICAqL1xuICBzYXZlRW50aXRpZXMoYWN0aW9uOiBTYXZlRW50aXRpZXMpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGNvbnN0IGVycm9yID0gYWN0aW9uLnBheWxvYWQuZXJyb3I7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTYXZlRW50aXRpZXNFcnJvciQoYWN0aW9uKShlcnJvcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBjaGFuZ2VTZXQgPSBleGNsdWRlRW1wdHlDaGFuZ2VTZXRJdGVtcyhhY3Rpb24ucGF5bG9hZC5jaGFuZ2VTZXQpO1xuICAgICAgY29uc3QgeyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcsIHVybCB9ID0gYWN0aW9uLnBheWxvYWQ7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgICAgaWYgKGNoYW5nZVNldC5jaGFuZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBub3RoaW5nIHRvIHNhdmVcbiAgICAgICAgcmV0dXJuIG9mKG5ldyBTYXZlRW50aXRpZXNTdWNjZXNzKGNoYW5nZVNldCwgdXJsLCBvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbGxhdGlvbjogcmV0dXJucyBPYnNlcnZhYmxlPFNhdmVFbnRpdGllc0NhbmNlbGVkPiBmb3IgYSBzYXZlRW50aXRpZXMgYWN0aW9uXG4gICAgICAvLyB3aG9zZSBjb3JyZWxhdGlvbklkIG1hdGNoZXMgdGhlIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbklkXG4gICAgICBjb25zdCBjID0gdGhpcy5zYXZlRW50aXRpZXNDYW5jZWwkLnBpcGUoXG4gICAgICAgIGZpbHRlcigoYSkgPT4gY29ycmVsYXRpb25JZCA9PT0gYS5wYXlsb2FkLmNvcnJlbGF0aW9uSWQpLFxuICAgICAgICBtYXAoXG4gICAgICAgICAgKGEpID0+XG4gICAgICAgICAgICBuZXcgU2F2ZUVudGl0aWVzQ2FuY2VsZWQoXG4gICAgICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICAgIGEucGF5bG9hZC5yZWFzb24sXG4gICAgICAgICAgICAgIGEucGF5bG9hZC50YWdcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgLy8gRGF0YTogU2F2ZUVudGl0aWVzIHJlc3VsdCBhcyBhIFNhdmVFbnRpdGllc1N1Y2Nlc3MgYWN0aW9uXG4gICAgICBjb25zdCBkID0gdGhpcy5kYXRhU2VydmljZS5zYXZlRW50aXRpZXMoY2hhbmdlU2V0LCB1cmwpLnBpcGUoXG4gICAgICAgIGNvbmNhdE1hcCgocmVzdWx0KSA9PlxuICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzU3VjY2VzcyQoXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnlcbiAgICAgICAgICApKHJlc3VsdClcbiAgICAgICAgKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZVNhdmVFbnRpdGllc0Vycm9yJChhY3Rpb24pKVxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCB3aGljaCBldmVyIGdldHMgdGhlcmUgZmlyc3Q7IHRoZSBvdGhlciBvYnNlcnZhYmxlIGlzIHRlcm1pbmF0ZWQuXG4gICAgICByZXR1cm4gcmFjZShjLCBkKTtcbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKGFjdGlvbikoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogcmV0dXJuIGhhbmRsZXIgb2YgZXJyb3IgcmVzdWx0IG9mIHNhdmVFbnRpdGllcywgcmV0dXJuaW5nIGEgc2NhbGFyIG9ic2VydmFibGUgb2YgZXJyb3IgYWN0aW9uICovXG4gIHByaXZhdGUgaGFuZGxlU2F2ZUVudGl0aWVzRXJyb3IkKFxuICAgIGFjdGlvbjogU2F2ZUVudGl0aWVzXG4gICk6IChlcnI6IERhdGFTZXJ2aWNlRXJyb3IgfCBFcnJvcikgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICAvLyBBbHRob3VnaCBlcnJvciBtYXkgcmV0dXJuIGltbWVkaWF0ZWx5LFxuICAgIC8vIGVuc3VyZSBvYnNlcnZhYmxlIHRha2VzIHNvbWUgdGltZSxcbiAgICAvLyBhcyBhcHAgbGlrZWx5IGFzc3VtZXMgYXN5bmNocm9ub3VzIHJlc3BvbnNlLlxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc0Vycm9yKGVycm9yLCBhY3Rpb24pKS5waXBlKFxuICAgICAgICBkZWxheSh0aGlzLnJlc3BvbnNlRGVsYXksIHRoaXMuc2NoZWR1bGVyIHx8IGFzeW5jU2NoZWR1bGVyKVxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqIHJldHVybiBoYW5kbGVyIG9mIHRoZSBDaGFuZ2VTZXQgcmVzdWx0IG9mIHN1Y2Nlc3NmdWwgc2F2ZUVudGl0aWVzKCkgKi9cbiAgcHJpdmF0ZSBoYW5kbGVTYXZlRW50aXRpZXNTdWNjZXNzJChcbiAgICBhY3Rpb246IFNhdmVFbnRpdGllcyxcbiAgICBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5XG4gICk6IChjaGFuZ2VTZXQ6IENoYW5nZVNldCkgPT4gT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICBjb25zdCB7IHVybCwgY29ycmVsYXRpb25JZCwgbWVyZ2VTdHJhdGVneSwgdGFnIH0gPSBhY3Rpb24ucGF5bG9hZDtcbiAgICBjb25zdCBvcHRpb25zID0geyBjb3JyZWxhdGlvbklkLCBtZXJnZVN0cmF0ZWd5LCB0YWcgfTtcblxuICAgIHJldHVybiAoY2hhbmdlU2V0KSA9PiB7XG4gICAgICAvLyBEYXRhU2VydmljZSByZXR1cm5lZCBhIENoYW5nZVNldCB3aXRoIHBvc3NpYmxlIHVwZGF0ZXMgdG8gdGhlIHNhdmVkIGVudGl0aWVzXG4gICAgICBpZiAoY2hhbmdlU2V0KSB7XG4gICAgICAgIHJldHVybiBvZihuZXcgU2F2ZUVudGl0aWVzU3VjY2VzcyhjaGFuZ2VTZXQsIHVybCwgb3B0aW9ucykpO1xuICAgICAgfVxuXG4gICAgICAvLyBObyBDaGFuZ2VTZXQgPSBTZXJ2ZXIgcHJvYmFibHkgcmVzcG9uZGVkICcyMDQgLSBObyBDb250ZW50JyBiZWNhdXNlXG4gICAgICAvLyBpdCBtYWRlIG5vIGNoYW5nZXMgdG8gdGhlIGluc2VydGVkL3VwZGF0ZWQgZW50aXRpZXMuXG4gICAgICAvLyBSZXNwb25kIHdpdGggc3VjY2VzcyBhY3Rpb24gYmVzdCBvbiB0aGUgQ2hhbmdlU2V0IGluIHRoZSByZXF1ZXN0LlxuICAgICAgY2hhbmdlU2V0ID0gYWN0aW9uLnBheWxvYWQuY2hhbmdlU2V0O1xuXG4gICAgICAvLyBJZiBwZXNzaW1pc3RpYyBzYXZlLCByZXR1cm4gc3VjY2VzcyBhY3Rpb24gd2l0aCB0aGUgb3JpZ2luYWwgQ2hhbmdlU2V0XG4gICAgICBpZiAoIWFjdGlvbi5wYXlsb2FkLmlzT3B0aW1pc3RpYykge1xuICAgICAgICByZXR1cm4gb2YobmV3IFNhdmVFbnRpdGllc1N1Y2Nlc3MoY2hhbmdlU2V0LCB1cmwsIG9wdGlvbnMpKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgb3B0aW1pc3RpYyBzYXZlLCBhdm9pZCBjYWNoZSBncmluZGluZyBieSBqdXN0IHR1cm5pbmcgb2ZmIHRoZSBsb2FkaW5nIGZsYWdzXG4gICAgICAvLyBmb3IgYWxsIGNvbGxlY3Rpb25zIGluIHRoZSBvcmlnaW5hbCBDaGFuZ2VTZXRcbiAgICAgIGNvbnN0IGVudGl0eU5hbWVzID0gY2hhbmdlU2V0LmNoYW5nZXMucmVkdWNlKFxuICAgICAgICAoYWNjLCBpdGVtKSA9PlxuICAgICAgICAgIGFjYy5pbmRleE9mKGl0ZW0uZW50aXR5TmFtZSkgPT09IC0xXG4gICAgICAgICAgICA/IGFjYy5jb25jYXQoaXRlbS5lbnRpdHlOYW1lKVxuICAgICAgICAgICAgOiBhY2MsXG4gICAgICAgIFtdIGFzIHN0cmluZ1tdXG4gICAgICApO1xuICAgICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICBlbnRpdHlOYW1lcy5tYXAoKG5hbWUpID0+XG4gICAgICAgICAgZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGUobmFtZSwgRW50aXR5T3AuU0VUX0xPQURJTkcsIGZhbHNlKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==