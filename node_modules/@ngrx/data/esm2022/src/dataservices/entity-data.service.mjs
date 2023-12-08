import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./default-data.service";
/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
export class EntityDataService {
    // TODO:  Optionally inject specialized entity data services
    // for those that aren't derived from BaseDataService.
    constructor(defaultDataServiceFactory) {
        this.defaultDataServiceFactory = defaultDataServiceFactory;
        this.services = {};
    }
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     */
    getService(entityName) {
        entityName = entityName.trim();
        let service = this.services[entityName];
        if (!service) {
            service = this.defaultDataServiceFactory.create(entityName);
            this.services[entityName] = service;
        }
        return service;
    }
    /**
     * Register an EntityCollectionDataService for an entity type
     * @param entityName - the name of the entity type
     * @param service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     */
    registerService(entityName, service) {
        this.services[entityName.trim()] = service;
    }
    /**
     * Register a batch of data services.
     * @param services - data services to merge into existing services
     *
     * Examples:
     *   registerServices({
     *     Hero: myHeroDataService,
     *     Villain: myVillainDataService
     *   });
     */
    registerServices(services) {
        this.services = { ...this.services, ...services };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService, deps: [{ token: i1.DefaultDataServiceFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DefaultDataServiceFactory }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL2VudGl0eS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSzNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxpQkFBaUI7SUFHNUIsNERBQTREO0lBQzVELHNEQUFzRDtJQUN0RCxZQUFzQix5QkFBb0Q7UUFBcEQsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUpoRSxhQUFRLEdBQXlELEVBQUUsQ0FBQztJQUlELENBQUM7SUFFOUU7Ozs7Ozs7T0FPRztJQUNILFVBQVUsQ0FBSSxVQUFrQjtRQUM5QixVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsZUFBZSxDQUNiLFVBQWtCLEVBQ2xCLE9BQXVDO1FBRXZDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxnQkFBZ0IsQ0FBQyxRQUVoQjtRQUNDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUNwRCxDQUFDO2lJQXZEVSxpQkFBaUI7cUlBQWpCLGlCQUFpQjs7MkZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IERlZmF1bHREYXRhU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS5zZXJ2aWNlJztcblxuLyoqXG4gKiBSZWdpc3RyeSBvZiBFbnRpdHlDb2xsZWN0aW9uIGRhdGEgc2VydmljZXMgdGhhdCBtYWtlIFJFU1QtbGlrZSBDUlVEIGNhbGxzXG4gKiB0byBlbnRpdHkgY29sbGVjdGlvbiBlbmRwb2ludHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhU2VydmljZSB7XG4gIHByb3RlY3RlZCBzZXJ2aWNlczogeyBbbmFtZTogc3RyaW5nXTogRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPGFueT4gfSA9IHt9O1xuXG4gIC8vIFRPRE86ICBPcHRpb25hbGx5IGluamVjdCBzcGVjaWFsaXplZCBlbnRpdHkgZGF0YSBzZXJ2aWNlc1xuICAvLyBmb3IgdGhvc2UgdGhhdCBhcmVuJ3QgZGVyaXZlZCBmcm9tIEJhc2VEYXRhU2VydmljZS5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlZmF1bHREYXRhU2VydmljZUZhY3Rvcnk6IERlZmF1bHREYXRhU2VydmljZUZhY3RvcnkpIHt9XG5cbiAgLyoqXG4gICAqIEdldCAob3IgY3JlYXRlKSBhIGRhdGEgc2VydmljZSBmb3IgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICBnZXRTZXJ2aWNlKCdIZXJvJyk7IC8vIGRhdGEgc2VydmljZSBmb3IgSGVyb2VzLCB1bnR5cGVkXG4gICAqICAgZ2V0U2VydmljZTxIZXJvPignSGVybycpOyAvLyBkYXRhIHNlcnZpY2UgZm9yIEhlcm9lcywgdHlwZWQgYXMgSGVyb1xuICAgKi9cbiAgZ2V0U2VydmljZTxUPihlbnRpdHlOYW1lOiBzdHJpbmcpOiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2U8VD4ge1xuICAgIGVudGl0eU5hbWUgPSBlbnRpdHlOYW1lLnRyaW0oKTtcbiAgICBsZXQgc2VydmljZSA9IHRoaXMuc2VydmljZXNbZW50aXR5TmFtZV07XG4gICAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgICBzZXJ2aWNlID0gdGhpcy5kZWZhdWx0RGF0YVNlcnZpY2VGYWN0b3J5LmNyZWF0ZShlbnRpdHlOYW1lKTtcbiAgICAgIHRoaXMuc2VydmljZXNbZW50aXR5TmFtZV0gPSBzZXJ2aWNlO1xuICAgIH1cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UgZm9yIGFuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBzZXJ2aWNlIC0gZGF0YSBzZXJ2aWNlIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyU2VydmljZSgnSGVybycsIG15SGVyb0RhdGFTZXJ2aWNlKTtcbiAgICogICByZWdpc3RlclNlcnZpY2UoJ1ZpbGxhaW4nLCBteVZpbGxhaW5EYXRhU2VydmljZSk7XG4gICAqL1xuICByZWdpc3RlclNlcnZpY2U8VD4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHNlcnZpY2U6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPlxuICApIHtcbiAgICB0aGlzLnNlcnZpY2VzW2VudGl0eU5hbWUudHJpbSgpXSA9IHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBiYXRjaCBvZiBkYXRhIHNlcnZpY2VzLlxuICAgKiBAcGFyYW0gc2VydmljZXMgLSBkYXRhIHNlcnZpY2VzIHRvIG1lcmdlIGludG8gZXhpc3Rpbmcgc2VydmljZXNcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJTZXJ2aWNlcyh7XG4gICAqICAgICBIZXJvOiBteUhlcm9EYXRhU2VydmljZSxcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbkRhdGFTZXJ2aWNlXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3RlclNlcnZpY2VzKHNlcnZpY2VzOiB7XG4gICAgW25hbWU6IHN0cmluZ106IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxhbnk+O1xuICB9KSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IHsgLi4udGhpcy5zZXJ2aWNlcywgLi4uc2VydmljZXMgfTtcbiAgfVxufVxuIl19