import { Inject, Injectable } from '@angular/core';
import { ScannedActionsSubject } from '@ngrx/store';
import { shareReplay } from 'rxjs/operators';
import { defaultSelectId } from '../utils/utilities';
import { ENTITY_CACHE_SELECTOR_TOKEN, } from '../selectors/entity-cache-selector';
import { EntityDispatcherBase } from './entity-dispatcher-base';
import * as i0 from "@angular/core";
import * as i1 from "../actions/entity-action-factory";
import * as i2 from "@ngrx/store";
import * as i3 from "./entity-dispatcher-default-options";
import * as i4 from "../utils/correlation-id-generator";
import * as i5 from "rxjs";
/** Creates EntityDispatchers for entity collections */
export class EntityDispatcherFactory {
    constructor(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
        this.entityCacheSelector = entityCacheSelector;
        this.correlationIdGenerator = correlationIdGenerator;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     */
    create(
    /** Name of the entity type */
    entityName, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     * @param {IdSelector<T>} selectId
     */
    selectId = defaultSelectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     * @param {Partial<EntityDispatcherDefaultOptions>} defaultOptions
     */
    defaultOptions = {}) {
        // merge w/ defaultOptions with injected defaults
        const options = {
            ...this.entityDispatcherDefaultOptions,
            ...defaultOptions,
        };
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    }
    ngOnDestroy() {
        this.raSubscription.unsubscribe();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory, deps: [{ token: i1.EntityActionFactory }, { token: i2.Store }, { token: i3.EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: ENTITY_CACHE_SELECTOR_TOKEN }, { token: i4.CorrelationIdGenerator }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityActionFactory }, { type: i2.Store }, { type: i3.EntityDispatcherDefaultOptions }, { type: i5.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }, { type: i4.CorrelationIdGenerator }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQWlCLHFCQUFxQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR25FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHckQsT0FBTyxFQUVMLDJCQUEyQixHQUM1QixNQUFNLG9DQUFvQyxDQUFDO0FBRTVDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7O0FBRWhFLHVEQUF1RDtBQUV2RCxNQUFNLE9BQU8sdUJBQXVCO0lBUWxDLFlBQ1UsbUJBQXdDLEVBQ3hDLEtBQXlCLEVBQ3pCLDhCQUE4RCxFQUN2QyxlQUFtQyxFQUUxRCxtQkFBd0MsRUFDeEMsc0JBQThDO1FBTjlDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFDekIsbUNBQThCLEdBQTlCLDhCQUE4QixDQUFnQztRQUc5RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFFdEQsdUZBQXVGO1FBQ3ZGLHNEQUFzRDtRQUN0RCx3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELHdFQUF3RTtRQUN4RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTTtJQUNKLDhCQUE4QjtJQUM5QixVQUFrQjtJQUNsQjs7OztPQUlHO0lBQ0gsV0FBMEIsZUFBZTtJQUN6Qzs7O09BR0c7SUFDSCxpQkFBMEQsRUFBRTtRQUU1RCxpREFBaUQ7UUFDakQsTUFBTSxPQUFPLEdBQW1DO1lBQzlDLEdBQUcsSUFBSSxDQUFDLDhCQUE4QjtZQUN0QyxHQUFHLGNBQWM7U0FDbEIsQ0FBQztRQUNGLE9BQU8sSUFBSSxvQkFBb0IsQ0FDN0IsVUFBVSxFQUNWLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsSUFBSSxDQUFDLEtBQUssRUFDVixRQUFRLEVBQ1IsT0FBTyxFQUNQLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsSUFBSSxDQUFDLHNCQUFzQixDQUM1QixDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BDLENBQUM7aUlBOURVLHVCQUF1Qix3SEFZeEIscUJBQXFCLGFBQ3JCLDJCQUEyQjtxSUFiMUIsdUJBQXVCOzsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVOzswQkFhTixNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQzVCLE1BQU07MkJBQUMsMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUsIFNjYW5uZWRBY3Rpb25zU3ViamVjdCB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IElkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9lbnRpdHknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzaGFyZVJlcGxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29ycmVsYXRpb25JZEdlbmVyYXRvciB9IGZyb20gJy4uL3V0aWxzL2NvcnJlbGF0aW9uLWlkLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2VudGl0eS1kaXNwYXRjaGVyLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0U2VsZWN0SWQgfSBmcm9tICcuLi91dGlscy91dGlsaXRpZXMnO1xuaW1wb3J0IHsgRW50aXR5QWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbi1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7XG4gIEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gIEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTixcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1jYWNoZS1zZWxlY3Rvcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyIH0gZnJvbSAnLi9lbnRpdHktZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBFbnRpdHlEaXNwYXRjaGVyQmFzZSB9IGZyb20gJy4vZW50aXR5LWRpc3BhdGNoZXItYmFzZSc7XG5cbi8qKiBDcmVhdGVzIEVudGl0eURpc3BhdGNoZXJzIGZvciBlbnRpdHkgY29sbGVjdGlvbnMgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIHJlZHVjZWRBY3Rpb25zJDogT2JzZXJ2YWJsZTxBY3Rpb24+O1xuICBwcml2YXRlIHJhU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbnRpdHlBY3Rpb25GYWN0b3J5OiBFbnRpdHlBY3Rpb25GYWN0b3J5LFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEVudGl0eUNhY2hlPixcbiAgICBwcml2YXRlIGVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9uczogRW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zLFxuICAgIEBJbmplY3QoU2Nhbm5lZEFjdGlvbnNTdWJqZWN0KSBzY2FubmVkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPixcbiAgICBASW5qZWN0KEVOVElUWV9DQUNIRV9TRUxFQ1RPUl9UT0tFTilcbiAgICBwcml2YXRlIGVudGl0eUNhY2hlU2VsZWN0b3I6IEVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgcHJpdmF0ZSBjb3JyZWxhdGlvbklkR2VuZXJhdG9yOiBDb3JyZWxhdGlvbklkR2VuZXJhdG9yXG4gICkge1xuICAgIC8vIFJlcGxheSBiZWNhdXNlIHNvbWV0aW1lcyBpbiB0ZXN0cyB3aWxsIGZha2UgZGF0YSBzZXJ2aWNlIHdpdGggc3luY2hyb25vdXMgb2JzZXJ2YWJsZVxuICAgIC8vIHdoaWNoIG1ha2VzIHN1YnNjcmliZXIgbWlzcyB0aGUgZGlzcGF0Y2hlZCBhY3Rpb25zLlxuICAgIC8vIE9mIGNvdXJzZSB0aGF0J3MgYSB0ZXN0aW5nIG1pc3Rha2UuIEJ1dCBlYXN5IHRvIGZvcmdldCwgbGVhZGluZyB0byBwYWluZnVsIGRlYnVnZ2luZy5cbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IHNjYW5uZWRBY3Rpb25zJC5waXBlKHNoYXJlUmVwbGF5KDEpKTtcbiAgICAvLyBTdGFydCBsaXN0ZW5pbmcgc28gbGF0ZSBzdWJzY3JpYmVyIHdvbid0IG1pc3MgdGhlIG1vc3QgcmVjZW50IGFjdGlvbi5cbiAgICB0aGlzLnJhU3Vic2NyaXB0aW9uID0gdGhpcy5yZWR1Y2VkQWN0aW9ucyQuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGBFbnRpdHlEaXNwYXRjaGVyYCBmb3IgYW4gZW50aXR5IHR5cGUgYFRgIGFuZCBzdG9yZS5cbiAgICovXG4gIGNyZWF0ZTxUPihcbiAgICAvKiogTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgKi9cbiAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwcmltYXJ5IGtleSBmb3IgYW4gZW50aXR5IGBUYC5cbiAgICAgKiBVc3VhbGx5IGFjcXVpcmVkIGZyb20gYEVudGl0eURlZmluaXRpb25gIG1ldGFkYXRhLlxuICAgICAqIEBwYXJhbSB7SWRTZWxlY3RvcjxUPn0gc2VsZWN0SWRcbiAgICAgKi9cbiAgICBzZWxlY3RJZDogSWRTZWxlY3RvcjxUPiA9IGRlZmF1bHRTZWxlY3RJZCxcbiAgICAvKiogRGVmYXVsdHMgZm9yIG9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgZGlzcGF0Y2hlciBiZWhhdmlvciBzdWNoIGFzIHdoZXRoZXJcbiAgICAgKiBgYWRkKClgIGlzIG9wdGltaXN0aWMgb3IgcGVzc2ltaXN0aWM7XG4gICAgICogQHBhcmFtIHtQYXJ0aWFsPEVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucz59IGRlZmF1bHRPcHRpb25zXG4gICAgICovXG4gICAgZGVmYXVsdE9wdGlvbnM6IFBhcnRpYWw8RW50aXR5RGlzcGF0Y2hlckRlZmF1bHRPcHRpb25zPiA9IHt9XG4gICk6IEVudGl0eURpc3BhdGNoZXI8VD4ge1xuICAgIC8vIG1lcmdlIHcvIGRlZmF1bHRPcHRpb25zIHdpdGggaW5qZWN0ZWQgZGVmYXVsdHNcbiAgICBjb25zdCBvcHRpb25zOiBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmVudGl0eURpc3BhdGNoZXJEZWZhdWx0T3B0aW9ucyxcbiAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBFbnRpdHlEaXNwYXRjaGVyQmFzZTxUPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnksXG4gICAgICB0aGlzLnN0b3JlLFxuICAgICAgc2VsZWN0SWQsXG4gICAgICBvcHRpb25zLFxuICAgICAgdGhpcy5yZWR1Y2VkQWN0aW9ucyQsXG4gICAgICB0aGlzLmVudGl0eUNhY2hlU2VsZWN0b3IsXG4gICAgICB0aGlzLmNvcnJlbGF0aW9uSWRHZW5lcmF0b3JcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yYVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=