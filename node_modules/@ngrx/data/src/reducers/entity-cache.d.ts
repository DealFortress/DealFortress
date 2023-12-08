import { EntityCollection } from './entity-collection';
export interface EntityCache {
    [name: string]: EntityCollection<any>;
}
