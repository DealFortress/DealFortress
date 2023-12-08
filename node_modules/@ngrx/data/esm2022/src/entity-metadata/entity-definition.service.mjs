import { Inject, Injectable, Optional } from '@angular/core';
import { createEntityDefinition } from './entity-definition';
import { ENTITY_METADATA_TOKEN, } from './entity-metadata';
import * as i0 from "@angular/core";
/** Registry of EntityDefinitions for all cached entity types */
export class EntityDefinitionService {
    constructor(entityMetadataMaps) {
        /** {EntityDefinition} for all cached entity types */
        this.definitions = {};
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach((map) => this.registerMetadataMap(map));
        }
    }
    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getDefinition('Hero'); // definition for Heroes, untyped
     *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
     */
    getDefinition(entityName, shouldThrow = true) {
        entityName = entityName.trim();
        const definition = this.definitions[entityName];
        if (!definition && shouldThrow) {
            throw new Error(`No EntityDefinition for entity type "${entityName}".`);
        }
        return definition;
    }
    //////// Registration methods //////////
    /**
     * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
     * @param name - the name of the entity type
     * @param definition - {EntityMetadata} for a collection for that entity type
     *
     * Examples:
     *   registerMetadata(myHeroEntityDefinition);
     */
    registerMetadata(metadata) {
        if (metadata) {
            const definition = createEntityDefinition(metadata);
            this.registerDefinition(definition);
        }
    }
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
    registerMetadataMap(metadataMap = {}) {
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach((entityName) => this.registerMetadata({ entityName, ...metadataMap[entityName] }));
    }
    /**
     * Register an {EntityDefinition} for an entity type
     * @param definition - EntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroEntityDefinition);
     */
    registerDefinition(definition) {
        this.definitions[definition.entityName] = definition;
    }
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
    registerDefinitions(definitions) {
        Object.assign(this.definitions, definitions);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDefinitionService, deps: [{ token: ENTITY_METADATA_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDefinitionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDefinitionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_METADATA_TOKEN]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRlZmluaXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxzQkFBc0IsRUFBb0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMvRSxPQUFPLEVBR0wscUJBQXFCLEdBQ3RCLE1BQU0sbUJBQW1CLENBQUM7O0FBTTNCLGdFQUFnRTtBQUVoRSxNQUFNLE9BQU8sdUJBQXVCO0lBSWxDLFlBR0Usa0JBQXVDO1FBTnpDLHFEQUFxRDtRQUNwQyxnQkFBVyxHQUFzQixFQUFFLENBQUM7UUFPbkQsSUFBSSxrQkFBa0IsRUFBRTtZQUN0QixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxhQUFhLENBQ1gsVUFBa0IsRUFDbEIsV0FBVyxHQUFHLElBQUk7UUFFbEIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLFVBQVUsSUFBSSxDQUFDLENBQUM7U0FDekU7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsd0NBQXdDO0lBRXhDOzs7Ozs7O09BT0c7SUFDSCxnQkFBZ0IsQ0FBQyxRQUF3QjtRQUN2QyxJQUFJLFFBQVEsRUFBRTtZQUNaLE1BQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxtQkFBbUIsQ0FBQyxjQUFpQyxFQUFFO1FBQ3JELHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUNwRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUNsRSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGtCQUFrQixDQUFJLFVBQStCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsbUJBQW1CLENBQUMsV0FBOEI7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQy9DLENBQUM7aUlBM0ZVLHVCQUF1QixrQkFNeEIscUJBQXFCO3FJQU5wQix1QkFBdUI7OzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7OzBCQU1OLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBjcmVhdGVFbnRpdHlEZWZpbml0aW9uLCBFbnRpdHlEZWZpbml0aW9uIH0gZnJvbSAnLi9lbnRpdHktZGVmaW5pdGlvbic7XG5pbXBvcnQge1xuICBFbnRpdHlNZXRhZGF0YSxcbiAgRW50aXR5TWV0YWRhdGFNYXAsXG4gIEVOVElUWV9NRVRBREFUQV9UT0tFTixcbn0gZnJvbSAnLi9lbnRpdHktbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURlZmluaXRpb25zIHtcbiAgW2VudGl0eU5hbWU6IHN0cmluZ106IEVudGl0eURlZmluaXRpb248YW55Pjtcbn1cblxuLyoqIFJlZ2lzdHJ5IG9mIEVudGl0eURlZmluaXRpb25zIGZvciBhbGwgY2FjaGVkIGVudGl0eSB0eXBlcyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eURlZmluaXRpb25TZXJ2aWNlIHtcbiAgLyoqIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgYWxsIGNhY2hlZCBlbnRpdHkgdHlwZXMgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBkZWZpbml0aW9uczogRW50aXR5RGVmaW5pdGlvbnMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoRU5USVRZX01FVEFEQVRBX1RPS0VOKVxuICAgIGVudGl0eU1ldGFkYXRhTWFwczogRW50aXR5TWV0YWRhdGFNYXBbXVxuICApIHtcbiAgICBpZiAoZW50aXR5TWV0YWRhdGFNYXBzKSB7XG4gICAgICBlbnRpdHlNZXRhZGF0YU1hcHMuZm9yRWFjaCgobWFwKSA9PiB0aGlzLnJlZ2lzdGVyTWV0YWRhdGFNYXAobWFwKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCAob3IgY3JlYXRlKSBhIGRhdGEgc2VydmljZSBmb3IgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGVudGl0eU5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdHlwZVxuICAgKlxuICAgKiBFeGFtcGxlczpcbiAgICogICBnZXREZWZpbml0aW9uKCdIZXJvJyk7IC8vIGRlZmluaXRpb24gZm9yIEhlcm9lcywgdW50eXBlZFxuICAgKiAgIGdldERlZmluaXRpb248SGVybz4oYEhlcm9gKTsgLy8gZGVmaW5pdGlvbiBmb3IgSGVyb2VzLCB0eXBlZCB3aXRoIEhlcm8gaW50ZXJmYWNlXG4gICAqL1xuICBnZXREZWZpbml0aW9uPFQ+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBzaG91bGRUaHJvdyA9IHRydWVcbiAgKTogRW50aXR5RGVmaW5pdGlvbjxUPiB7XG4gICAgZW50aXR5TmFtZSA9IGVudGl0eU5hbWUudHJpbSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmRlZmluaXRpb25zW2VudGl0eU5hbWVdO1xuICAgIGlmICghZGVmaW5pdGlvbiAmJiBzaG91bGRUaHJvdykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBFbnRpdHlEZWZpbml0aW9uIGZvciBlbnRpdHkgdHlwZSBcIiR7ZW50aXR5TmFtZX1cIi5gKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmluaXRpb247XG4gIH1cblxuICAvLy8vLy8vLyBSZWdpc3RyYXRpb24gbWV0aG9kcyAvLy8vLy8vLy8vXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbmQgcmVnaXN0ZXIgdGhlIHtFbnRpdHlEZWZpbml0aW9ufSBmb3IgdGhlIHtFbnRpdHlNZXRhZGF0YX0gb2YgYW4gZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZW50aXR5IHR5cGVcbiAgICogQHBhcmFtIGRlZmluaXRpb24gLSB7RW50aXR5TWV0YWRhdGF9IGZvciBhIGNvbGxlY3Rpb24gZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJNZXRhZGF0YShteUhlcm9FbnRpdHlEZWZpbml0aW9uKTtcbiAgICovXG4gIHJlZ2lzdGVyTWV0YWRhdGEobWV0YWRhdGE6IEVudGl0eU1ldGFkYXRhKSB7XG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICBjb25zdCBkZWZpbml0aW9uID0gY3JlYXRlRW50aXR5RGVmaW5pdGlvbihtZXRhZGF0YSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyRGVmaW5pdGlvbihkZWZpbml0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gRW50aXR5TWV0YWRhdGFNYXAuXG4gICAqIEBwYXJhbSBtZXRhZGF0YU1hcCAtIGEgbWFwIG9mIGVudGl0eVR5cGUgbmFtZXMgdG8gZW50aXR5IG1ldGFkYXRhXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyTWV0YWRhdGFNYXAoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9NZXRhZGF0YSxcbiAgICogICAgIFZpbGxhaW46IG15VmlsbGFpbk1ldGFkYXRhXG4gICAqICAgfSk7XG4gICAqL1xuICByZWdpc3Rlck1ldGFkYXRhTWFwKG1ldGFkYXRhTWFwOiBFbnRpdHlNZXRhZGF0YU1hcCA9IHt9KSB7XG4gICAgLy8gVGhlIGVudGl0eSB0eXBlIG5hbWUgc2hvdWxkIGJlIHRoZSBzYW1lIGFzIHRoZSBtYXAga2V5XG4gICAgT2JqZWN0LmtleXMobWV0YWRhdGFNYXAgfHwge30pLmZvckVhY2goKGVudGl0eU5hbWUpID0+XG4gICAgICB0aGlzLnJlZ2lzdGVyTWV0YWRhdGEoeyBlbnRpdHlOYW1lLCAuLi5tZXRhZGF0YU1hcFtlbnRpdHlOYW1lXSB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4ge0VudGl0eURlZmluaXRpb259IGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZGVmaW5pdGlvbiAtIEVudGl0eURlZmluaXRpb24gb2YgYSBjb2xsZWN0aW9uIGZvciB0aGF0IGVudGl0eSB0eXBlXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbignSGVybycsIG15SGVyb0VudGl0eURlZmluaXRpb24pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9uPFQ+KGRlZmluaXRpb246IEVudGl0eURlZmluaXRpb248VD4pIHtcbiAgICB0aGlzLmRlZmluaXRpb25zW2RlZmluaXRpb24uZW50aXR5TmFtZV0gPSBkZWZpbml0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgYmF0Y2ggb2YgRW50aXR5RGVmaW5pdGlvbnMuXG4gICAqIEBwYXJhbSBkZWZpbml0aW9ucyAtIG1hcCBvZiBlbnRpdHlUeXBlIG5hbWUgYW5kIGFzc29jaWF0ZWQgRW50aXR5RGVmaW5pdGlvbnMgdG8gbWVyZ2UuXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKiAgIHJlZ2lzdGVyRGVmaW5pdGlvbnMoe1xuICAgKiAgICAgJ0hlcm8nOiBteUhlcm9FbnRpdHlEZWZpbml0aW9uLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluRW50aXR5RGVmaW5pdGlvblxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJEZWZpbml0aW9ucyhkZWZpbml0aW9uczogRW50aXR5RGVmaW5pdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbnMsIGRlZmluaXRpb25zKTtcbiAgfVxufVxuIl19