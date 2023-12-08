import { OnDestroy } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { IdSelector } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCacheSelector } from '../selectors/entity-cache-selector';
import { EntityDispatcher } from './entity-dispatcher';
import * as i0 from "@angular/core";
/** Creates EntityDispatchers for entity collections */
export declare class EntityDispatcherFactory implements OnDestroy {
    private entityActionFactory;
    private store;
    private entityDispatcherDefaultOptions;
    private entityCacheSelector;
    private correlationIdGenerator;
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    reducedActions$: Observable<Action>;
    private raSubscription;
    constructor(entityActionFactory: EntityActionFactory, store: Store<EntityCache>, entityDispatcherDefaultOptions: EntityDispatcherDefaultOptions, scannedActions$: Observable<Action>, entityCacheSelector: EntityCacheSelector, correlationIdGenerator: CorrelationIdGenerator);
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     */
    create<T>(
    /** Name of the entity type */
    entityName: string, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     * @param {IdSelector<T>} selectId
     */
    selectId?: IdSelector<T>, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     * @param {Partial<EntityDispatcherDefaultOptions>} defaultOptions
     */
    defaultOptions?: Partial<EntityDispatcherDefaultOptions>): EntityDispatcher<T>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDispatcherFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityDispatcherFactory>;
}
