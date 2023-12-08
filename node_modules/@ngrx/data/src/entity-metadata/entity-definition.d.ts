import { EntityAdapter } from '@ngrx/entity';
import { Comparer, IdSelector } from '@ngrx/entity';
import { EntityDispatcherDefaultOptions } from '../dispatchers/entity-dispatcher-default-options';
import { EntityCollection } from '../reducers/entity-collection';
import { EntityMetadata } from './entity-metadata';
export interface EntityDefinition<T = any> {
    entityName: string;
    entityAdapter: EntityAdapter<T>;
    entityDispatcherOptions?: Partial<EntityDispatcherDefaultOptions>;
    initialState: EntityCollection<T>;
    metadata: EntityMetadata<T>;
    noChangeTracking: boolean;
    selectId: IdSelector<T>;
    sortComparer: false | Comparer<T>;
}
export declare function createEntityDefinition<T, S extends object>(metadata: EntityMetadata<T, S>): EntityDefinition<T>;
