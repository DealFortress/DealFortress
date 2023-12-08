import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-services-elements";
/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @usageNotes
 * ```ts
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 * ```
 */
export class EntityServicesBase {
    // Dear @ngrx/data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    constructor(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /** Registry of EntityCollectionService instances */
        this.EntityCollectionServices = {};
    }
    // #region EntityServicesElement-based properties
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    get entityActionErrors$() {
        return this.entityServicesElements.entityActionErrors$;
    }
    /** Observable of the entire entity cache */
    get entityCache$() {
        return this.entityServicesElements.entityCache$;
    }
    /** Factory to create a default instance of an EntityCollectionService */
    get entityCollectionServiceFactory() {
        return this.entityServicesElements.entityCollectionServiceFactory;
    }
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    get reducedActions$() {
        return this.entityServicesElements.reducedActions$;
    }
    /** The ngrx store, scoped to the EntityCache */
    get store() {
        return this.entityServicesElements.store;
    }
    // #endregion EntityServicesElement-based properties
    /** Dispatch any action to the store */
    dispatch(action) {
        this.store.dispatch(action);
    }
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    createEntityCollectionService(entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    }
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    getEntityCollectionService(entityName) {
        let service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    }
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    registerEntityCollectionService(service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    }
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    registerEntityCollectionServices(entityCollectionServices) {
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach((service) => this.registerEntityCollectionService(service));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((serviceName) => {
                this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            });
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase, deps: [{ token: i1.EntityServicesElements }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityServicesElements }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LXNlcnZpY2VzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2VudGl0eS1zZXJ2aWNlcy9lbnRpdHktc2VydmljZXMtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFhM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFDN0IseUVBQXlFO0lBQ3pFLDZEQUE2RDtJQUM3RCw2Q0FBNkM7SUFDN0MsRUFBRTtJQUNGLGtEQUFrRDtJQUNsRCxzRUFBc0U7SUFDdEUsK0RBQStEO0lBQy9ELFlBQW9CLHNCQUE4QztRQUE5QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBdUNsRSxvREFBb0Q7UUFDbkMsNkJBQXdCLEdBQStCLEVBQUUsQ0FBQztJQXhDTixDQUFDO0lBRXRFLGlEQUFpRDtJQUVqRCxvRkFBb0Y7SUFDcEYsSUFBSSxtQkFBbUI7UUFDckIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUM7SUFDekQsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUM7SUFDbEQsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxJQUFJLDhCQUE4QjtRQUNoQyxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyw4QkFBOEIsQ0FBQztJQUNwRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQztJQUNyRCxDQUFDO0lBRUQsZ0RBQWdEO0lBQ2hELElBQWMsS0FBSztRQUNqQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUM7SUFDM0MsQ0FBQztJQUVELG9EQUFvRDtJQUVwRCx1Q0FBdUM7SUFDdkMsUUFBUSxDQUFDLE1BQWM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUtEOzs7OztPQUtHO0lBQ08sNkJBQTZCLENBR3JDLFVBQWtCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBUSxVQUFVLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7O09BRUc7SUFDSCwwQkFBMEIsQ0FHeEIsVUFBa0I7UUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFRLFVBQVUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILCtCQUErQixDQUM3QixPQUFtQyxFQUNuQyxXQUFvQjtRQUVwQixJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDN0UsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZ0NBQWdDLENBQzlCLHdCQUVrQztRQUVsQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsRUFBRTtZQUMzQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUMzQyxJQUFJLENBQUMsK0JBQStCLENBQUMsT0FBTyxDQUFDLENBQzlDLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDbEUsSUFBSSxDQUFDLCtCQUErQixDQUNsQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsRUFDckMsV0FBVyxDQUNaLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztpSUFqSFUsa0JBQWtCO3FJQUFsQixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDYWNoZSB9IGZyb20gJy4uL3JlZHVjZXJzL2VudGl0eS1jYWNoZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXNlcnZpY2UtZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCwgRW50aXR5U2VydmljZXMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcyc7XG5pbXBvcnQgeyBFbnRpdHlTZWxlY3RvcnMkIH0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMkJztcbmltcG9ydCB7IEVudGl0eVNlcnZpY2VzRWxlbWVudHMgfSBmcm9tICcuL2VudGl0eS1zZXJ2aWNlcy1lbGVtZW50cyc7XG5cbi8qKlxuICogQmFzZS9kZWZhdWx0IGNsYXNzIG9mIGEgY2VudHJhbCByZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgZm9yIGFsbCBlbnRpdHkgdHlwZXMuXG4gKiBDcmVhdGUgeW91ciBvd24gc3ViY2xhc3MgdG8gYWRkIGFwcC1zcGVjaWZpYyBtZW1iZXJzIGZvciBhbiBpbXByb3ZlZCBkZXZlbG9wZXIgZXhwZXJpZW5jZS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogYGBgdHNcbiAqIGV4cG9ydCBjbGFzcyBFbnRpdHlTZXJ2aWNlcyBleHRlbmRzIEVudGl0eVNlcnZpY2VzQmFzZSB7XG4gKiAgIGNvbnN0cnVjdG9yKGVudGl0eVNlcnZpY2VzRWxlbWVudHM6IEVudGl0eVNlcnZpY2VzRWxlbWVudHMpIHtcbiAqICAgICBzdXBlcihlbnRpdHlTZXJ2aWNlc0VsZW1lbnRzKTtcbiAqICAgfVxuICogICAvLyBFeHRlbmQgd2l0aCB3ZWxsLWtub3duLCBhcHAgZW50aXR5IGNvbGxlY3Rpb24gc2VydmljZXNcbiAqICAgLy8gQ29udmVuaWVuY2UgcHJvcGVydHkgdG8gcmV0dXJuIGEgdHlwZWQgY3VzdG9tIGVudGl0eSBjb2xsZWN0aW9uIHNlcnZpY2VcbiAqICAgZ2V0IGNvbXBhbnlTZXJ2aWNlKCkge1xuICogICAgIHJldHVybiB0aGlzLmdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPE1vZGVsLkNvbXBhbnk+KCdDb21wYW55JykgYXMgQ29tcGFueVNlcnZpY2U7XG4gKiAgIH1cbiAqICAgLy8gQ29udmVuaWVuY2UgZGlzcGF0Y2ggbWV0aG9kc1xuICogICBjbGVhckNvbXBhbnkoY29tcGFueUlkOiBzdHJpbmcpIHtcbiAqICAgICB0aGlzLmRpc3BhdGNoKG5ldyBDbGVhckNvbXBhbnlBY3Rpb24oY29tcGFueUlkKSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5U2VydmljZXNCYXNlIGltcGxlbWVudHMgRW50aXR5U2VydmljZXMge1xuICAvLyBEZWFyIEBuZ3J4L2RhdGEgZGV2ZWxvcGVyOiB0aGluayBoYXJkIGJlZm9yZSBjaGFuZ2luZyB0aGUgY29uc3RydWN0b3IuXG4gIC8vIERvaW5nIHNvIHdpbGwgYnJlYWsgYXBwcyB0aGF0IGRlcml2ZSBmcm9tIHRoaXMgYmFzZSBjbGFzcyxcbiAgLy8gYW5kIG1hbnkgYXBwcyB3aWxsIGRlcml2ZSBmcm9tIHRoaXMgY2xhc3MuXG4gIC8vXG4gIC8vIERvIG5vdCBnaXZlIHRoaXMgY29uc3RydWN0b3IgYW4gaW1wbGVtZW50YXRpb24uXG4gIC8vIERvaW5nIHNvIG1ha2VzIGl0IGhhcmQgdG8gbW9jayBjbGFzc2VzIHRoYXQgZGVyaXZlIGZyb20gdGhpcyBjbGFzcy5cbiAgLy8gVXNlIGdldHRlciBwcm9wZXJ0aWVzIGluc3RlYWQuIEZvciBleGFtcGxlLCBzZWUgZW50aXR5Q2FjaGUkXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5U2VydmljZXNFbGVtZW50czogRW50aXR5U2VydmljZXNFbGVtZW50cykge31cblxuICAvLyAjcmVnaW9uIEVudGl0eVNlcnZpY2VzRWxlbWVudC1iYXNlZCBwcm9wZXJ0aWVzXG5cbiAgLyoqIE9ic2VydmFibGUgb2YgZXJyb3IgRW50aXR5QWN0aW9ucyAoZS5nLiBRVUVSWV9BTExfRVJST1IpIGZvciBhbGwgZW50aXR5IHR5cGVzICovXG4gIGdldCBlbnRpdHlBY3Rpb25FcnJvcnMkKCk6IE9ic2VydmFibGU8RW50aXR5QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlBY3Rpb25FcnJvcnMkO1xuICB9XG5cbiAgLyoqIE9ic2VydmFibGUgb2YgdGhlIGVudGlyZSBlbnRpdHkgY2FjaGUgKi9cbiAgZ2V0IGVudGl0eUNhY2hlJCgpOiBPYnNlcnZhYmxlPEVudGl0eUNhY2hlPiB8IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5lbnRpdHlDYWNoZSQ7XG4gIH1cblxuICAvKiogRmFjdG9yeSB0byBjcmVhdGUgYSBkZWZhdWx0IGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlICovXG4gIGdldCBlbnRpdHlDb2xsZWN0aW9uU2VydmljZUZhY3RvcnkoKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2VGYWN0b3J5IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3Rpb25zIHNjYW5uZWQgYnkgdGhlIHN0b3JlIGFmdGVyIGl0IHByb2Nlc3NlZCB0aGVtIHdpdGggcmVkdWNlcnMuXG4gICAqIEEgcmVwbGF5IG9ic2VydmFibGUgb2YgdGhlIG1vc3QgcmVjZW50IGFjdGlvbiByZWR1Y2VkIGJ5IHRoZSBzdG9yZS5cbiAgICovXG4gIGdldCByZWR1Y2VkQWN0aW9ucyQoKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlTZXJ2aWNlc0VsZW1lbnRzLnJlZHVjZWRBY3Rpb25zJDtcbiAgfVxuXG4gIC8qKiBUaGUgbmdyeCBzdG9yZSwgc2NvcGVkIHRvIHRoZSBFbnRpdHlDYWNoZSAqL1xuICBwcm90ZWN0ZWQgZ2V0IHN0b3JlKCk6IFN0b3JlPEVudGl0eUNhY2hlPiB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5U2VydmljZXNFbGVtZW50cy5zdG9yZTtcbiAgfVxuXG4gIC8vICNlbmRyZWdpb24gRW50aXR5U2VydmljZXNFbGVtZW50LWJhc2VkIHByb3BlcnRpZXNcblxuICAvKiogRGlzcGF0Y2ggYW55IGFjdGlvbiB0byB0aGUgc3RvcmUgKi9cbiAgZGlzcGF0Y2goYWN0aW9uOiBBY3Rpb24pIHtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKGFjdGlvbik7XG4gIH1cblxuICAvKiogUmVnaXN0cnkgb2YgRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgaW5zdGFuY2VzICovXG4gIHByaXZhdGUgcmVhZG9ubHkgRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZU1hcCA9IHt9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgZGVmYXVsdCBpbnN0YW5jZSBvZiBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZS5cbiAgICogUHJlZmVyIGdldEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKCkgdW5sZXNzIHlvdSByZWFsbHkgd2FudCBhIG5ldyBkZWZhdWx0IGluc3RhbmNlLlxuICAgKiBUaGlzIG9uZSB3aWxsIE5PVCBiZSByZWdpc3RlcmVkIHdpdGggRW50aXR5U2VydmljZXMhXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8XG4gICAgVCxcbiAgICBTJCBleHRlbmRzIEVudGl0eVNlbGVjdG9ycyQ8VD4gPSBFbnRpdHlTZWxlY3RvcnMkPFQ+XG4gID4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblNlcnZpY2U8VD4ge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRmFjdG9yeS5jcmVhdGU8VCwgUyQ+KGVudGl0eU5hbWUpO1xuICB9XG5cbiAgLyoqIEdldCAob3IgY3JlYXRlKSB0aGUgc2luZ2xldG9uIGluc3RhbmNlIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICBnZXRFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxcbiAgICBULFxuICAgIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbiAgPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxUPiB7XG4gICAgbGV0IHNlcnZpY2UgPSB0aGlzLkVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgIHNlcnZpY2UgPSB0aGlzLmNyZWF0ZUVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQsIFMkPihlbnRpdHlOYW1lKTtcbiAgICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW2VudGl0eU5hbWVdID0gc2VydmljZTtcbiAgICB9XG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKiogUmVnaXN0ZXIgYW4gRW50aXR5Q29sbGVjdGlvblNlcnZpY2UgdW5kZXIgaXRzIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIFdpbGwgcmVwbGFjZSBhIHByZS1leGlzdGluZyBzZXJ2aWNlIGZvciB0aGF0IHR5cGUuXG4gICAqIEBwYXJhbSBzZXJ2aWNlIHtFbnRpdHlDb2xsZWN0aW9uU2VydmljZX0gVGhlIGVudGl0eSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBzZXJ2aWNlTmFtZSB7c3RyaW5nfSBvcHRpb25hbCBzZXJ2aWNlIG5hbWUgdG8gdXNlIGluc3RlYWQgb2YgdGhlIHNlcnZpY2UncyBlbnRpdHlOYW1lXG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+KFxuICAgIHNlcnZpY2U6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPFQ+LFxuICAgIHNlcnZpY2VOYW1lPzogc3RyaW5nXG4gICkge1xuICAgIHRoaXMuRW50aXR5Q29sbGVjdGlvblNlcnZpY2VzW3NlcnZpY2VOYW1lIHx8IHNlcnZpY2UuZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGVudGl0eSBzZXJ2aWNlcyBmb3Igc2V2ZXJhbCBlbnRpdHkgdHlwZXMgYXQgb25jZS5cbiAgICogV2lsbCByZXBsYWNlIGEgcHJlLWV4aXN0aW5nIHNlcnZpY2UgZm9yIHRoYXQgdHlwZS5cbiAgICogQHBhcmFtIGVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB7RW50aXR5Q29sbGVjdGlvblNlcnZpY2VNYXAgfCBFbnRpdHlDb2xsZWN0aW9uU2VydmljZTxhbnk+W119XG4gICAqIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyB0byByZWdpc3RlciwgZWl0aGVyIGFzIGEgbWFwIG9yIGFuIGFycmF5XG4gICAqL1xuICByZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlcyhcbiAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXM6XG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlTWFwXG4gICAgICB8IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlPGFueT5bXVxuICApOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMpKSB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMuZm9yRWFjaCgoc2VydmljZSkgPT5cbiAgICAgICAgdGhpcy5yZWdpc3RlckVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlKHNlcnZpY2UpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhlbnRpdHlDb2xsZWN0aW9uU2VydmljZXMgfHwge30pLmZvckVhY2goKHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbnRpdHlDb2xsZWN0aW9uU2VydmljZShcbiAgICAgICAgICBlbnRpdHlDb2xsZWN0aW9uU2VydmljZXNbc2VydmljZU5hbWVdLFxuICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==