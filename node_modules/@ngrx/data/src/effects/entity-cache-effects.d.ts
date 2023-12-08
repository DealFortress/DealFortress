import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, SchedulerLike } from 'rxjs';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { SaveEntities, SaveEntitiesCancel } from '../actions/entity-cache-action';
import { EntityCacheDataService } from '../dataservices/entity-cache-data.service';
import { Logger } from '../utils/interfaces';
import * as i0 from "@angular/core";
export declare class EntityCacheEffects {
    private actions;
    private dataService;
    private entityActionFactory;
    private logger;
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    private scheduler;
    /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
    private responseDelay;
    constructor(actions: Actions, dataService: EntityCacheDataService, entityActionFactory: EntityActionFactory, logger: Logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler: SchedulerLike);
    /**
     * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
     */
    saveEntitiesCancel$: Observable<SaveEntitiesCancel>;
    saveEntities$: Observable<Action>;
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action: SaveEntities): Observable<Action>;
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    private handleSaveEntitiesError$;
    /** return handler of the ChangeSet result of successful saveEntities() */
    private handleSaveEntitiesSuccess$;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCacheEffects, [null, null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCacheEffects>;
}
