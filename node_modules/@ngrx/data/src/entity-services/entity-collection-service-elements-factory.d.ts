import { EntityDispatcher } from '../dispatchers/entity-dispatcher';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { EntitySelectors, EntitySelectorsFactory } from '../selectors/entity-selectors';
import { EntitySelectors$, EntitySelectors$Factory } from '../selectors/entity-selectors$';
import * as i0 from "@angular/core";
/** Core ingredients of an EntityCollectionService */
export interface EntityCollectionServiceElements<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>> {
    readonly dispatcher: EntityDispatcher<T>;
    readonly entityName: string;
    readonly selectors: EntitySelectors<T>;
    readonly selectors$: S$;
}
/** Creates the core elements of the EntityCollectionService for an entity type. */
export declare class EntityCollectionServiceElementsFactory {
    private entityDispatcherFactory;
    private entityDefinitionService;
    private entitySelectorsFactory;
    private entitySelectors$Factory;
    constructor(entityDispatcherFactory: EntityDispatcherFactory, entityDefinitionService: EntityDefinitionService, entitySelectorsFactory: EntitySelectorsFactory, entitySelectors$Factory: EntitySelectors$Factory);
    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @param entityName - name of the entity type
     */
    create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(entityName: string): EntityCollectionServiceElements<T, S$>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityCollectionServiceElementsFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityCollectionServiceElementsFactory>;
}
