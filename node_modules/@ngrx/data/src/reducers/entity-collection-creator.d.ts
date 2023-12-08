import { EntityCollection } from './entity-collection';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import * as i0 from "@angular/core";
export declare class EntityCollectionCreator {
    private entityDefinitionService?;
    constructor(entityDefinitionService?: EntityDefinitionService);
    /**
     * Create the default collection for an entity type.
     * @param entityName {string} entity type name
     */
    create<T = any, S extends EntityCollection<T> = EntityCollection<T>>(entityName: string): S;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCollectionCreator, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCollectionCreator>;
}
export declare function createEmptyEntityCollection<T>(entityName?: string): EntityCollection<T>;
