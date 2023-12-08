import { Inject, Injectable, Optional } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { asyncScheduler, of, race } from 'rxjs';
import { catchError, delay, filter, map, mergeMap } from 'rxjs/operators';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { EntityOp, makeSuccessOp } from '../actions/entity-op';
import { ofEntityOp } from '../actions/entity-action-operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "../dataservices/entity-data.service";
import * as i3 from "../actions/entity-action-factory";
import * as i4 from "../dataservices/persistence-result-handler.service";
export const persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
export class EntityEffects {
    constructor(actions, dataService, entityActionFactory, resultHandler, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.resultHandler = resultHandler;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         */
        this.cancel$ = createEffect(() => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((action) => action.payload.correlationId), filter((id) => id != null)), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect(() => this.actions.pipe(ofEntityOp(persistOps), mergeMap((action) => this.persist(action))));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    persist(action) {
        if (action.payload.skip) {
            // Should not persist. Pretend it succeeded.
            return this.handleSkipSuccess$(action);
        }
        if (action.payload.error) {
            return this.handleError$(action)(action.payload.error);
        }
        try {
            // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
            // whose correlationId matches cancellation correlationId
            const c = this.cancel$.pipe(filter((id) => action.payload.correlationId === id), map((id) => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            })));
            // Data: entity collection DataService result as a successful persistence EntityAction
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    callDataService(action) {
        const { entityName, entityOp, data, httpOptions } = action.payload;
        const service = this.dataService.getService(entityName);
        switch (entityOp) {
            case EntityOp.QUERY_ALL:
            case EntityOp.QUERY_LOAD:
                return service.getAll(httpOptions);
            case EntityOp.QUERY_BY_KEY:
                return service.getById(data, httpOptions);
            case EntityOp.QUERY_MANY:
                return service.getWithQuery(data, httpOptions);
            case EntityOp.SAVE_ADD_ONE:
                return service.add(data, httpOptions);
            case EntityOp.SAVE_DELETE_ONE:
                return service.delete(data, httpOptions);
            case EntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data; // data must be Update<T>
                return service.update(data, httpOptions).pipe(map((updatedEntity) => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    const responseData = hasData
                        ? { id, changes: { ...changes, ...updatedEntity }, changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                }));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data, httpOptions).pipe(map((upsertedEntity) => {
                    const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                }));
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented.`);
        }
    }
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    handleError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    handleSkipSuccess$(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        const successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects, deps: [{ token: i1.Actions }, { token: i2.EntityDataService }, { token: i3.EntityActionFactory }, { token: i4.PersistenceResultHandler }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Actions }, { type: i2.EntityDataService }, { type: i3.EntityActionFactory }, { type: i4.PersistenceResultHandler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWVmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VmZmVjdHMvZW50aXR5LWVmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBVyxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdEQsT0FBTyxFQUFFLGNBQWMsRUFBYyxFQUFFLEVBQUUsSUFBSSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOzs7Ozs7QUFNaEUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFlO0lBQ3BDLFFBQVEsQ0FBQyxTQUFTO0lBQ2xCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxVQUFVO0lBQ25CLFFBQVEsQ0FBQyxZQUFZO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlO0NBQ3pCLENBQUM7QUFHRixNQUFNLE9BQU8sYUFBYTtJQTBCeEIsWUFDVSxPQUE4QixFQUM5QixXQUE4QixFQUM5QixtQkFBd0MsRUFDeEMsYUFBdUM7SUFDL0M7Ozs7T0FJRztJQUdLLFNBQXdCO1FBWHhCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBQzlCLGdCQUFXLEdBQVgs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R0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQzdELGNBQWMsRUFDZDtZQUNFLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQ0YsQ0FBQztRQUNGLGdDQUFnQztRQUNoQyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7aUlBdktVLGFBQWEscUpBcUNkLHdCQUF3QjtxSUFyQ3ZCLGFBQWE7OzJGQUFiLGFBQWE7a0JBRHpCLFVBQVU7OzBCQXFDTixRQUFROzswQkFDUixNQUFNOzJCQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIGNyZWF0ZUVmZmVjdCB9IGZyb20gJ0BuZ3J4L2VmZmVjdHMnO1xuaW1wb3J0IHsgVXBkYXRlIH0gZnJvbSAnQG5ncngvZW50aXR5JztcblxuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCByYWNlLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBkZWxheSwgZmlsdGVyLCBtYXAsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBFbnRpdHlBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1hY3Rpb24nO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUiB9IGZyb20gJy4vZW50aXR5LWVmZmVjdHMtc2NoZWR1bGVyJztcbmltcG9ydCB7IEVudGl0eU9wLCBtYWtlU3VjY2Vzc09wIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktb3AnO1xuaW1wb3J0IHsgb2ZFbnRpdHlPcCB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBkYXRlUmVzcG9uc2VEYXRhIH0gZnJvbSAnLi4vYWN0aW9ucy91cGRhdGUtcmVzcG9uc2UtZGF0YSc7XG5cbmltcG9ydCB7IEVudGl0eURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVyc2lzdGVuY2VSZXN1bHRIYW5kbGVyIH0gZnJvbSAnLi4vZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgcGVyc2lzdE9wczogRW50aXR5T3BbXSA9IFtcbiAgRW50aXR5T3AuUVVFUllfQUxMLFxuICBFbnRpdHlPcC5RVUVSWV9MT0FELFxuICBFbnRpdHlPcC5RVUVSWV9CWV9LRVksXG4gIEVudGl0eU9wLlFVRVJZX01BTlksXG4gIEVudGl0eU9wLlNBVkVfQUREX09ORSxcbiAgRW50aXR5T3AuU0FWRV9ERUxFVEVfT05FLFxuICBFbnRpdHlPcC5TQVZFX1VQREFURV9PTkUsXG4gIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORSxcbl07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlFZmZlY3RzIHtcbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9ibG9iL21hc3Rlci9kb2MvbWFyYmxlLXRlc3RpbmcubWRcbiAgLyoqIERlbGF5IGZvciBlcnJvciBhbmQgc2tpcCBvYnNlcnZhYmxlcy4gTXVzdCBiZSBtdWx0aXBsZSBvZiAxMCBmb3IgbWFyYmxlIHRlc3RpbmcuICovXG4gIHByaXZhdGUgcmVzcG9uc2VEZWxheSA9IDEwO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIG9mIG5vbi1udWxsIGNhbmNlbGxhdGlvbiBjb3JyZWxhdGlvbiBpZHMgZnJvbSBDQU5DRUxfUEVSU0lTVCBhY3Rpb25zXG4gICAqL1xuICBjYW5jZWwkOiBPYnNlcnZhYmxlPGFueT4gPSBjcmVhdGVFZmZlY3QoXG4gICAgKCkgPT5cbiAgICAgIHRoaXMuYWN0aW9ucy5waXBlKFxuICAgICAgICBvZkVudGl0eU9wKEVudGl0eU9wLkNBTkNFTF9QRVJTSVNUKSxcbiAgICAgICAgbWFwKChhY3Rpb246IEVudGl0eUFjdGlvbikgPT4gYWN0aW9uLnBheWxvYWQuY29ycmVsYXRpb25JZCksXG4gICAgICAgIGZpbHRlcigoaWQpID0+IGlkICE9IG51bGwpXG4gICAgICApLFxuICAgIHsgZGlzcGF0Y2g6IGZhbHNlIH1cbiAgKTtcblxuICAvLyBgbWVyZ2VNYXBgIGFsbG93cyBmb3IgY29uY3VycmVudCByZXF1ZXN0cyB3aGljaCBtYXkgcmV0dXJuIGluIGFueSBvcmRlclxuICBwZXJzaXN0JDogT2JzZXJ2YWJsZTxBY3Rpb24+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zLnBpcGUoXG4gICAgICBvZkVudGl0eU9wKHBlcnNpc3RPcHMpLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbikgPT4gdGhpcy5wZXJzaXN0KGFjdGlvbikpXG4gICAgKVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgYWN0aW9uczogQWN0aW9uczxFbnRpdHlBY3Rpb24+LFxuICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IEVudGl0eURhdGFTZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5QWN0aW9uRmFjdG9yeTogRW50aXR5QWN0aW9uRmFjdG9yeSxcbiAgICBwcml2YXRlIHJlc3VsdEhhbmRsZXI6IFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlcixcbiAgICAvKipcbiAgICAgKiBJbmplY3RpbmcgYW4gb3B0aW9uYWwgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAgKiBpbiBub3JtYWwgYXBwbGljYXRpb24gdXNhZ2UsIGJ1dCBpdHMgaW5qZWN0ZWQgaGVyZSBzbyB0aGF0IHlvdSBjYW4gbW9jayBvdXRcbiAgICAgKiBkdXJpbmcgdGVzdGluZyB1c2luZyB0aGUgUnhKUyBUZXN0U2NoZWR1bGVyIGZvciBzaW11bGF0aW5nIHBhc3NhZ2VzIG9mIHRpbWUuXG4gICAgICovXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KEVOVElUWV9FRkZFQ1RTX1NDSEVEVUxFUilcbiAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gdGhlIHJlcXVlc3RlZCBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gYW5kIHJldHVybiBhIHNjYWxhciBPYnNlcnZhYmxlPEFjdGlvbj5cbiAgICogdGhhdCB0aGUgZWZmZWN0IHNob3VsZCBkaXNwYXRjaCB0byB0aGUgc3RvcmUgYWZ0ZXIgdGhlIHNlcnZlciByZXNwb25kcy5cbiAgICogQHBhcmFtIGFjdGlvbiBBIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBFbnRpdHlBY3Rpb25cbiAgICovXG4gIHBlcnNpc3QoYWN0aW9uOiBFbnRpdHlBY3Rpb24pOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5za2lwKSB7XG4gICAgICAvLyBTaG91bGQgbm90IHBlcnNpc3QuIFByZXRlbmQgaXQgc3VjY2VlZGVkLlxuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2tpcFN1Y2Nlc3MkKGFjdGlvbik7XG4gICAgfVxuICAgIGlmIChhY3Rpb24ucGF5bG9hZC5lcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikoYWN0aW9uLnBheWxvYWQuZXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uOiByZXR1cm5zIE9ic2VydmFibGUgb2YgQ0FOQ0VMRURfUEVSU0lTVCBmb3IgYSBwZXJzaXN0ZW5jZSBFbnRpdHlBY3Rpb25cbiAgICAgIC8vIHdob3NlIGNvcnJlbGF0aW9uSWQgbWF0Y2hlcyBjYW5jZWxsYXRpb24gY29ycmVsYXRpb25JZFxuICAgICAgY29uc3QgYyA9IHRoaXMuY2FuY2VsJC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGlkKSA9PiBhY3Rpb24ucGF5bG9hZC5jb3JyZWxhdGlvbklkID09PSBpZCksXG4gICAgICAgIG1hcCgoaWQpID0+XG4gICAgICAgICAgdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICBlbnRpdHlPcDogRW50aXR5T3AuQ0FOQ0VMRURfUEVSU0lTVCxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICAvLyBEYXRhOiBlbnRpdHkgY29sbGVjdGlvbiBEYXRhU2VydmljZSByZXN1bHQgYXMgYSBzdWNjZXNzZnVsIHBlcnNpc3RlbmNlIEVudGl0eUFjdGlvblxuICAgICAgY29uc3QgZCA9IHRoaXMuY2FsbERhdGFTZXJ2aWNlKGFjdGlvbikucGlwZShcbiAgICAgICAgbWFwKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVTdWNjZXNzKGFjdGlvbikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IkKGFjdGlvbikpXG4gICAgICApO1xuXG4gICAgICAvLyBFbWl0IHdoaWNoIGV2ZXIgZ2V0cyB0aGVyZSBmaXJzdDsgdGhlIG90aGVyIG9ic2VydmFibGUgaXMgdGVybWluYXRlZC5cbiAgICAgIHJldHVybiByYWNlKGMsIGQpO1xuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVFcnJvciQoYWN0aW9uKShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FsbERhdGFTZXJ2aWNlKGFjdGlvbjogRW50aXR5QWN0aW9uKSB7XG4gICAgY29uc3QgeyBlbnRpdHlOYW1lLCBlbnRpdHlPcCwgZGF0YSwgaHR0cE9wdGlvbnMgfSA9IGFjdGlvbi5wYXlsb2FkO1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldFNlcnZpY2UoZW50aXR5TmFtZSk7XG4gICAgc3dpdGNoIChlbnRpdHlPcCkge1xuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9BTEw6XG4gICAgICBjYXNlIEVudGl0eU9wLlFVRVJZX0xPQUQ6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmdldEFsbChodHRwT3B0aW9ucyk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuUVVFUllfQllfS0VZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRCeUlkKGRhdGEsIGh0dHBPcHRpb25zKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5RVUVSWV9NQU5ZOlxuICAgICAgICByZXR1cm4gc2VydmljZS5nZXRXaXRoUXVlcnkoZGF0YSwgaHR0cE9wdGlvbnMpO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfQUREX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuYWRkKGRhdGEsIGh0dHBPcHRpb25zKTtcblxuICAgICAgY2FzZSBFbnRpdHlPcC5TQVZFX0RFTEVURV9PTkU6XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLmRlbGV0ZShkYXRhLCBodHRwT3B0aW9ucyk7XG5cbiAgICAgIGNhc2UgRW50aXR5T3AuU0FWRV9VUERBVEVfT05FOlxuICAgICAgICBjb25zdCB7IGlkLCBjaGFuZ2VzIH0gPSBkYXRhIGFzIFVwZGF0ZTxhbnk+OyAvLyBkYXRhIG11c3QgYmUgVXBkYXRlPFQ+XG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnVwZGF0ZShkYXRhLCBodHRwT3B0aW9ucykucGlwZShcbiAgICAgICAgICBtYXAoKHVwZGF0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gUmV0dXJuIGFuIFVwZGF0ZTxUPiB3aXRoIHVwZGF0ZWQgZW50aXR5IGRhdGEuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgcmV0dXJuZWQgZW50aXR5IGRhdGEsIG1lcmdlIHdpdGggdGhlIGNoYW5nZXMgdGhhdCB3ZXJlIHNlbnRcbiAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlICdjaGFuZ2VkJyBmbGFnIHRvIHRydWUuXG4gICAgICAgICAgICAvLyBJZiBzZXJ2ZXIgZGlkIG5vdCByZXR1cm4gZW50aXR5IGRhdGEsXG4gICAgICAgICAgICAvLyBhc3N1bWUgaXQgbWFkZSBubyBhZGRpdGlvbmFsIGNoYW5nZXMgb2YgaXRzIG93biwgcmV0dXJuIHRoZSBvcmlnaW5hbCBjaGFuZ2VzLFxuICAgICAgICAgICAgLy8gYW5kIHNldCB0aGUgYGNoYW5nZWRgIGZsYWcgdG8gYGZhbHNlYC5cbiAgICAgICAgICAgIGNvbnN0IGhhc0RhdGEgPVxuICAgICAgICAgICAgICB1cGRhdGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwZGF0ZWRFbnRpdHkpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZURhdGE6IFVwZGF0ZVJlc3BvbnNlRGF0YTxhbnk+ID0gaGFzRGF0YVxuICAgICAgICAgICAgICA/IHsgaWQsIGNoYW5nZXM6IHsgLi4uY2hhbmdlcywgLi4udXBkYXRlZEVudGl0eSB9LCBjaGFuZ2VkOiB0cnVlIH1cbiAgICAgICAgICAgICAgOiB7IGlkLCBjaGFuZ2VzLCBjaGFuZ2VkOiBmYWxzZSB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICBjYXNlIEVudGl0eU9wLlNBVkVfVVBTRVJUX09ORTpcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UudXBzZXJ0KGRhdGEsIGh0dHBPcHRpb25zKS5waXBlKFxuICAgICAgICAgIG1hcCgodXBzZXJ0ZWRFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzRGF0YSA9XG4gICAgICAgICAgICAgIHVwc2VydGVkRW50aXR5ICYmIE9iamVjdC5rZXlzKHVwc2VydGVkRW50aXR5KS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgcmV0dXJuIGhhc0RhdGEgPyB1cHNlcnRlZEVudGl0eSA6IGRhdGE7IC8vIGVuc3VyZSBhIHJldHVybmVkIGVudGl0eSB2YWx1ZS5cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQZXJzaXN0ZW5jZSBhY3Rpb24gXCIke2VudGl0eU9wfVwiIGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uLFxuICAgKiByZXR1cm5pbmcgYSBzY2FsYXIgb2JzZXJ2YWJsZSBvZiBlcnJvciBhY3Rpb25cbiAgICovXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IkKFxuICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IChlcnJvcjogRXJyb3IpID0+IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgLy8gQWx0aG91Z2ggZXJyb3IgbWF5IHJldHVybiBpbW1lZGlhdGVseSxcbiAgICAvLyBlbnN1cmUgb2JzZXJ2YWJsZSB0YWtlcyBzb21lIHRpbWUsXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gKGVycm9yOiBFcnJvcikgPT5cbiAgICAgIG9mKHRoaXMucmVzdWx0SGFuZGxlci5oYW5kbGVFcnJvcihhY3Rpb24pKGVycm9yKSkucGlwZShcbiAgICAgICAgZGVsYXkodGhpcy5yZXNwb25zZURlbGF5LCB0aGlzLnNjaGVkdWxlciB8fCBhc3luY1NjaGVkdWxlcilcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQmVjYXVzZSBFbnRpdHlBY3Rpb24ucGF5bG9hZC5za2lwIGlzIHRydWUsIHNraXAgdGhlIHBlcnNpc3RlbmNlIHN0ZXAgYW5kXG4gICAqIHJldHVybiBhIHNjYWxhciBzdWNjZXNzIGFjdGlvbiB0aGF0IGxvb2tzIGxpa2UgdGhlIG9wZXJhdGlvbiBzdWNjZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIGhhbmRsZVNraXBTdWNjZXNzJChcbiAgICBvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uXG4gICk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgY29uc3Qgc3VjY2Vzc09wID0gbWFrZVN1Y2Nlc3NPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcbiAgICBjb25zdCBzdWNjZXNzQWN0aW9uID0gdGhpcy5lbnRpdHlBY3Rpb25GYWN0b3J5LmNyZWF0ZUZyb21BY3Rpb24oXG4gICAgICBvcmlnaW5hbEFjdGlvbixcbiAgICAgIHtcbiAgICAgICAgZW50aXR5T3A6IHN1Y2Nlc3NPcCxcbiAgICAgIH1cbiAgICApO1xuICAgIC8vIEFsdGhvdWdoIHJldHVybnMgaW1tZWRpYXRlbHksXG4gICAgLy8gZW5zdXJlIG9ic2VydmFibGUgdGFrZXMgb25lIHRpY2sgKGJ5IHVzaW5nIGEgcHJvbWlzZSksXG4gICAgLy8gYXMgYXBwIGxpa2VseSBhc3N1bWVzIGFzeW5jaHJvbm91cyByZXNwb25zZS5cbiAgICByZXR1cm4gb2Yoc3VjY2Vzc0FjdGlvbikucGlwZShcbiAgICAgIGRlbGF5KHRoaXMucmVzcG9uc2VEZWxheSwgdGhpcy5zY2hlZHVsZXIgfHwgYXN5bmNTY2hlZHVsZXIpXG4gICAgKTtcbiAgfVxufVxuIl19