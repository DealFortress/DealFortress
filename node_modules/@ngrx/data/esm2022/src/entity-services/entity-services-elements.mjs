import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-service-factory";
import * as i2 from "../dispatchers/entity-dispatcher-factory";
import * as i3 from "../selectors/entity-selectors$";
import * as i4 from "@ngrx/store";
/** Core ingredients of an EntityServices class */
export class EntityServicesElements {
    constructor(
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    entityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory, 
    /** The ngrx store, scoped to the EntityCache */
    store) {
        this.entityCollectionServiceFactory = entityCollectionServiceFactory;
        this.store = store;
        this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements, deps: [{ token: i1.EntityCollectionServiceFactory }, { token: i2.EntityDispatcherFactory }, { token: i3.EntitySelectors$Factory }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionServiceFactory }, { type: i2.EntityDispatcherFactory }, { type: i3.EntitySelectors$Factory }, { type: i4.Store }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LXNlcnZpY2VzLWVsZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQVUzQyxrREFBa0Q7QUFFbEQsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQztJQUNFOzs7T0FHRztJQUNhLDhCQUE4RDtJQUM5RSx1REFBdUQ7SUFDdkQsdUJBQWdEO0lBQ2hELGtFQUFrRTtJQUNsRSx1QkFBZ0Q7SUFDaEQsZ0RBQWdEO0lBQ2hDLEtBQXlCO1FBTnpCLG1DQUE4QixHQUE5Qiw4QkFBOEIsQ0FBZ0M7UUFNOUQsVUFBSyxHQUFMLEtBQUssQ0FBb0I7UUFFekMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLHVCQUF1QixDQUFDLG1CQUFtQixDQUFDO1FBQ3ZFLElBQUksQ0FBQyxZQUFZLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDO1FBQ3pELElBQUksQ0FBQyxlQUFlLEdBQUcsdUJBQXVCLENBQUMsZUFBZSxDQUFDO0lBQ2pFLENBQUM7aUlBakJVLHNCQUFzQjtxSUFBdEIsc0JBQXNCOzsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNhY2hlIH0gZnJvbSAnLi4vcmVkdWNlcnMvZW50aXR5LWNhY2hlJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeSB9IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5cbi8qKiBDb3JlIGluZ3JlZGllbnRzIG9mIGFuIEVudGl0eVNlcnZpY2VzIGNsYXNzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXNFbGVtZW50cyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzIGZvclxuICAgICAqIGEgY2FjaGVkIGNvbGxlY3Rpb24gb2YgVCBlbnRpdGllcyBpbiB0aGUgbmdyeCBzdG9yZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5OiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnksXG4gICAgLyoqIENyZWF0ZXMgRW50aXR5RGlzcGF0Y2hlcnMgZm9yIGVudGl0eSBjb2xsZWN0aW9ucyAqL1xuICAgIGVudGl0eURpc3BhdGNoZXJGYWN0b3J5OiBFbnRpdHlEaXNwYXRjaGVyRmFjdG9yeSxcbiAgICAvKiogQ3JlYXRlcyBvYnNlcnZhYmxlIEVudGl0eVNlbGVjdG9ycyQgZm9yIGVudGl0eSBjb2xsZWN0aW9ucy4gKi9cbiAgICBlbnRpdHlTZWxlY3RvcnMkRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG4gICAgLyoqIFRoZSBuZ3J4IHN0b3JlLCBzY29wZWQgdG8gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcHVibGljIHJlYWRvbmx5IHN0b3JlOiBTdG9yZTxFbnRpdHlDYWNoZT5cbiAgKSB7XG4gICAgdGhpcy5lbnRpdHlBY3Rpb25FcnJvcnMkID0gZW50aXR5U2VsZWN0b3JzJEZhY3RvcnkuZW50aXR5QWN0aW9uRXJyb3JzJDtcbiAgICB0aGlzLmVudGl0eUNhY2hlJCA9IGVudGl0eVNlbGVjdG9ycyRGYWN0b3J5LmVudGl0eUNhY2hlJDtcbiAgICB0aGlzLnJlZHVjZWRBY3Rpb25zJCA9IGVudGl0eURpc3BhdGNoZXJGYWN0b3J5LnJlZHVjZWRBY3Rpb25zJDtcbiAgfVxuXG4gIC8qKiBPYnNlcnZhYmxlIG9mIGVycm9yIEVudGl0eUFjdGlvbnMgKGUuZy4gUVVFUllfQUxMX0VSUk9SKSBmb3IgYWxsIGVudGl0eSB0eXBlcyAqL1xuICByZWFkb25seSBlbnRpdHlBY3Rpb25FcnJvcnMkOiBPYnNlcnZhYmxlPEVudGl0eUFjdGlvbj47XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgcmVhZG9ubHkgZW50aXR5Q2FjaGUkOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPjtcblxuICAvKipcbiAgICogQWN0aW9ucyBzY2FubmVkIGJ5IHRoZSBzdG9yZSBhZnRlciBpdCBwcm9jZXNzZWQgdGhlbSB3aXRoIHJlZHVjZXJzLlxuICAgKiBBIHJlcGxheSBvYnNlcnZhYmxlIG9mIHRoZSBtb3N0IHJlY2VudCBhY3Rpb24gcmVkdWNlZCBieSB0aGUgc3RvcmUuXG4gICAqL1xuICByZWFkb25seSByZWR1Y2VkQWN0aW9ucyQ6IE9ic2VydmFibGU8QWN0aW9uPjtcbn1cbiJdfQ==