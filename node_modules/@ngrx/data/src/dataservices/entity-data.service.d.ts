import { EntityCollectionDataService } from './interfaces';
import { DefaultDataServiceFactory } from './default-data.service';
import * as i0 from "@angular/core";
/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
export declare class EntityDataService {
    protected defaultDataServiceFactory: DefaultDataServiceFactory;
    protected services: {
        [name: string]: EntityCollectionDataService<any>;
    };
    constructor(defaultDataServiceFactory: DefaultDataServiceFactory);
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     */
    getService<T>(entityName: string): EntityCollectionDataService<T>;
    /**
     * Register an EntityCollectionDataService for an entity type
     * @param entityName - the name of the entity type
     * @param service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     */
    registerService<T>(entityName: string, service: EntityCollectionDataService<T>): void;
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
    registerServices(services: {
        [name: string]: EntityCollectionDataService<any>;
    }): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDataService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityDataService>;
}
