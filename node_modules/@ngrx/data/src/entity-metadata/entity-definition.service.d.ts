import { EntityDefinition } from './entity-definition';
import { EntityMetadata, EntityMetadataMap } from './entity-metadata';
import * as i0 from "@angular/core";
export interface EntityDefinitions {
    [entityName: string]: EntityDefinition<any>;
}
/** Registry of EntityDefinitions for all cached entity types */
export declare class EntityDefinitionService {
    /** {EntityDefinition} for all cached entity types */
    private readonly definitions;
    constructor(entityMetadataMaps: EntityMetadataMap[]);
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getDefinition('Hero'); // definition for Heroes, untyped
     *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
     */
    getDefinition<T>(entityName: string, shouldThrow?: boolean): EntityDefinition<T>;
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param name - the name of the entity type
     * @param definition - {EntityMetadata} for a collection for that entity type
     *
     * Examples:
     *   registerMetadata(myHeroEntityDefinition);
     */
    registerMetadata(metadata: EntityMetadata): void;
    /**
     * Register an EntityMetadataMap.
     * @param metadataMap - a map of entityType names to entity metadata
     *
     * Examples:
     *   registerMetadataMap({
     *     'Hero': myHeroMetadata,
     *     Villain: myVillainMetadata
     *   });
     */
    registerMetadataMap(metadataMap?: EntityMetadataMap): void;
    /**
     * Register an {EntityDefinition} for an entity type
     * @param definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     */
    registerDefinition<T>(definition: EntityDefinition<T>): void;
    /**
     * Register a batch of EntityDefinitions.
     * @param definitions - map of entityType name and associated EntityDefinitions to merge.
     *
     * Examples:
     *   registerDefinitions({
     *     'Hero': myHeroEntityDefinition,
     *     Villain: myVillainEntityDefinition
     *   });
     */
    registerDefinitions(definitions: EntityDefinitions): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDefinitionService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityDefinitionService>;
}
