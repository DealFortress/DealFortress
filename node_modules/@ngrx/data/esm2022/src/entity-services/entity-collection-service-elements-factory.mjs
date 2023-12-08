import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../dispatchers/entity-dispatcher-factory";
import * as i2 from "../entity-metadata/entity-definition.service";
import * as i3 from "../selectors/entity-selectors";
import * as i4 from "../selectors/entity-selectors$";
/** Creates the core elements of the EntityCollectionService for an entity type. */
export class EntityCollectionServiceElementsFactory {
    constructor(entityDispatcherFactory, entityDefinitionService, entitySelectorsFactory, entitySelectors$Factory) {
        this.entityDispatcherFactory = entityDispatcherFactory;
        this.entityDefinitionService = entityDefinitionService;
        this.entitySelectorsFactory = entitySelectorsFactory;
        this.entitySelectors$Factory = entitySelectors$Factory;
    }
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @param entityName - name of the entity type
     */
    create(entityName) {
        entityName = entityName.trim();
        const definition = this.entityDefinitionService.getDefinition(entityName);
        const dispatcher = this.entityDispatcherFactory.create(entityName, definition.selectId, definition.entityDispatcherOptions);
        const selectors = this.entitySelectorsFactory.create(definition.metadata);
        const selectors$ = this.entitySelectors$Factory.create(entityName, selectors);
        return {
            dispatcher,
            entityName,
            selectors,
            selectors$,
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, deps: [{ token: i1.EntityDispatcherFactory }, { token: i2.EntityDefinitionService }, { token: i3.EntitySelectorsFactory }, { token: i4.EntitySelectors$Factory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityDispatcherFactory }, { type: i2.EntityDefinitionService }, { type: i3.EntitySelectorsFactory }, { type: i4.EntitySelectors$Factory }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktc2VydmljZXMvZW50aXR5LWNvbGxlY3Rpb24tc2VydmljZS1lbGVtZW50cy1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQXdCM0MsbUZBQW1GO0FBRW5GLE1BQU0sT0FBTyxzQ0FBc0M7SUFDakQsWUFDVSx1QkFBZ0QsRUFDaEQsdUJBQWdELEVBQ2hELHNCQUE4QyxFQUM5Qyx1QkFBZ0Q7UUFIaEQsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtRQUNoRCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ2hELDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF5QjtJQUN2RCxDQUFDO0lBRUo7OztPQUdHO0lBQ0gsTUFBTSxDQUNKLFVBQWtCO1FBRWxCLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQ2QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBSSxVQUFVLENBQUMsQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUNwRCxVQUFVLEVBQ1YsVUFBVSxDQUFDLFFBQVEsRUFDbkIsVUFBVSxDQUFDLHVCQUF1QixDQUNuQyxDQUFDO1FBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FDbEQsVUFBVSxDQUFDLFFBQVEsQ0FDcEIsQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQ3BELFVBQVUsRUFDVixTQUFTLENBQ1YsQ0FBQztRQUNGLE9BQU87WUFDTCxVQUFVO1lBQ1YsVUFBVTtZQUNWLFNBQVM7WUFDVCxVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUM7aUlBcENVLHNDQUFzQztxSUFBdEMsc0NBQXNDOzsyRkFBdEMsc0NBQXNDO2tCQURsRCxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5RGlzcGF0Y2hlciB9IGZyb20gJy4uL2Rpc3BhdGNoZXJzL2VudGl0eS1kaXNwYXRjaGVyJztcbmltcG9ydCB7IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5IH0gZnJvbSAnLi4vZGlzcGF0Y2hlcnMvZW50aXR5LWRpc3BhdGNoZXItZmFjdG9yeSc7XG5pbXBvcnQgeyBFbnRpdHlEZWZpbml0aW9uU2VydmljZSB9IGZyb20gJy4uL2VudGl0eS1tZXRhZGF0YS9lbnRpdHktZGVmaW5pdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIEVudGl0eVNlbGVjdG9ycyxcbiAgRW50aXR5U2VsZWN0b3JzRmFjdG9yeSxcbn0gZnJvbSAnLi4vc2VsZWN0b3JzL2VudGl0eS1zZWxlY3RvcnMnO1xuaW1wb3J0IHtcbiAgRW50aXR5U2VsZWN0b3JzJCxcbiAgRW50aXR5U2VsZWN0b3JzJEZhY3RvcnksXG59IGZyb20gJy4uL3NlbGVjdG9ycy9lbnRpdHktc2VsZWN0b3JzJCc7XG5cbi8qKiBDb3JlIGluZ3JlZGllbnRzIG9mIGFuIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlICovXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHM8XG4gIFQsXG4gIFMkIGV4dGVuZHMgRW50aXR5U2VsZWN0b3JzJDxUPiA9IEVudGl0eVNlbGVjdG9ycyQ8VD5cbj4ge1xuICByZWFkb25seSBkaXNwYXRjaGVyOiBFbnRpdHlEaXNwYXRjaGVyPFQ+O1xuICByZWFkb25seSBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlbGVjdG9yczogRW50aXR5U2VsZWN0b3JzPFQ+O1xuICByZWFkb25seSBzZWxlY3RvcnMkOiBTJDtcbn1cblxuLyoqIENyZWF0ZXMgdGhlIGNvcmUgZWxlbWVudHMgb2YgdGhlIEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlIGZvciBhbiBlbnRpdHkgdHlwZS4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlDb2xsZWN0aW9uU2VydmljZUVsZW1lbnRzRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZW50aXR5RGlzcGF0Y2hlckZhY3Rvcnk6IEVudGl0eURpc3BhdGNoZXJGYWN0b3J5LFxuICAgIHByaXZhdGUgZW50aXR5RGVmaW5pdGlvblNlcnZpY2U6IEVudGl0eURlZmluaXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgZW50aXR5U2VsZWN0b3JzRmFjdG9yeTogRW50aXR5U2VsZWN0b3JzRmFjdG9yeSxcbiAgICBwcml2YXRlIGVudGl0eVNlbGVjdG9ycyRGYWN0b3J5OiBFbnRpdHlTZWxlY3RvcnMkRmFjdG9yeVxuICApIHt9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaW5ncmVkaWVudHMgZm9yIG1ha2luZyBhbiBFbnRpdHlDb2xsZWN0aW9uU2VydmljZSBmb3IgdGhpcyBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqL1xuICBjcmVhdGU8VCwgUyQgZXh0ZW5kcyBFbnRpdHlTZWxlY3RvcnMkPFQ+ID0gRW50aXR5U2VsZWN0b3JzJDxUPj4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nXG4gICk6IEVudGl0eUNvbGxlY3Rpb25TZXJ2aWNlRWxlbWVudHM8VCwgUyQ+IHtcbiAgICBlbnRpdHlOYW1lID0gZW50aXR5TmFtZS50cmltKCk7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9XG4gICAgICB0aGlzLmVudGl0eURlZmluaXRpb25TZXJ2aWNlLmdldERlZmluaXRpb248VD4oZW50aXR5TmFtZSk7XG4gICAgY29uc3QgZGlzcGF0Y2hlciA9IHRoaXMuZW50aXR5RGlzcGF0Y2hlckZhY3RvcnkuY3JlYXRlPFQ+KFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIGRlZmluaXRpb24uc2VsZWN0SWQsXG4gICAgICBkZWZpbml0aW9uLmVudGl0eURpc3BhdGNoZXJPcHRpb25zXG4gICAgKTtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSB0aGlzLmVudGl0eVNlbGVjdG9yc0ZhY3RvcnkuY3JlYXRlPFQ+KFxuICAgICAgZGVmaW5pdGlvbi5tZXRhZGF0YVxuICAgICk7XG4gICAgY29uc3Qgc2VsZWN0b3JzJCA9IHRoaXMuZW50aXR5U2VsZWN0b3JzJEZhY3RvcnkuY3JlYXRlPFQsIFMkPihcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICBzZWxlY3RvcnNcbiAgICApO1xuICAgIHJldHVybiB7XG4gICAgICBkaXNwYXRjaGVyLFxuICAgICAgZW50aXR5TmFtZSxcbiAgICAgIHNlbGVjdG9ycyxcbiAgICAgIHNlbGVjdG9ycyQsXG4gICAgfTtcbiAgfVxufVxuIl19