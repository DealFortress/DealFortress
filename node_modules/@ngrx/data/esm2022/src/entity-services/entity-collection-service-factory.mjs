import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase } from './entity-collection-service-base';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-service-elements-factory";
/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
export class EntityCollectionServiceFactory {
    constructor(
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    entityCollectionServiceElementsFactory) {
        this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
    }
    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    create(entityName) {
        return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory, deps: [{ token: i1.EntityCollectionServiceElementsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionServiceElementsFactory }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7OztBQUkvRTs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sOEJBQThCO0lBQ3pDO0lBQ0UsbUZBQW1GO0lBQzVFLHNDQUE4RTtRQUE5RSwyQ0FBc0MsR0FBdEMsc0NBQXNDLENBQXdDO0lBQ3BGLENBQUM7SUFFSjs7O09BR0c7SUFDSCxNQUFNLENBQ0osVUFBa0I7UUFFbEIsT0FBTyxJQUFJLDJCQUEyQixDQUNwQyxVQUFVLEVBQ1YsSUFBSSxDQUFDLHNDQUFzQyxDQUM1QyxDQUFDO0lBQ0osQ0FBQztpSUFqQlUsOEJBQThCO3FJQUE5Qiw4QkFBOEI7OzJGQUE5Qiw4QkFBOEI7a0JBRDFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUJhc2UgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtYmFzZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5JztcbmltcG9ydCB7IEVudGl0eVNlbGVjdG9ycyQgfSBmcm9tICcuLi9zZWxlY3RvcnMvZW50aXR5LXNlbGVjdG9ycyQnO1xuXG4vKipcbiAqIENyZWF0ZXMgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzIGZvclxuICogYSBjYWNoZWQgY29sbGVjdGlvbiBvZiBUIGVudGl0aWVzIGluIHRoZSBuZ3J4IHN0b3JlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIENyZWF0ZXMgdGhlIGNvcmUgZWxlbWVudHMgb2YgdGhlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZS4gKi9cbiAgICBwdWJsaWMgZW50aXR5Q29sbGVjdGlvblNlcnZpY2VFbGVtZW50c0ZhY3Rvcnk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHNGYWN0b3J5XG4gICkge31cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBjcmVhdGU8VCwgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlQmFzZTxULCBTJD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeVxuICAgICk7XG4gIH1cbn1cbiJdfQ==