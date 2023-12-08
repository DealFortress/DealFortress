import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, SchedulerLike } from 'rxjs';
import { EntityAction } from '../actions/entity-action';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityOp } from '../actions/entity-op';
import { EntityDataService } from '../dataservices/entity-data.service';
import { PersistenceResultHandler } from '../dataservices/persistence-result-handler.service';
import * as i0 from "@angular/core";
export declare const persistOps: EntityOp[];
export declare class EntityEffects {
    private actions;
    private dataService;
    private entityActionFactory;
    private resultHandler;
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    private scheduler;
    /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
    private responseDelay;
    /**
     * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
     */
    cancel$: Observable<any>;
    persist$: Observable<Action>;
    constructor(actions: Actions<EntityAction>, dataService: EntityDataService, entityActionFactory: EntityActionFactory, resultHandler: PersistenceResultHandler, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler: SchedulerLike);
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    persist(action: EntityAction): Observable<Action>;
    private callDataService;
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    private handleError$;
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    private handleSkipSuccess$;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityEffects, [null, null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityEffects>;
}
