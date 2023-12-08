import { IdSelector, Update } from '@ngrx/entity';
import { EntityAction } from './entity-action';
import { UpdateResponseData } from '../actions/update-response-data';
/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 */
export declare class EntityActionGuard<T> {
    private entityName;
    private selectId;
    constructor(entityName: string, selectId: IdSelector<T>);
    /** Throw if the action payload is not an entity with a valid key */
    mustBeEntity(action: EntityAction<T>): T;
    /** Throw if the action payload is not an array of entities with valid keys */
    mustBeEntities(action: EntityAction<T[]>): T[];
    /** Throw if the action payload is not a single, valid key */
    mustBeKey(action: EntityAction<string | number>): string | number | never;
    /** Throw if the action payload is not an array of valid keys */
    mustBeKeys(action: EntityAction<(string | number)[]>): (string | number)[];
    /** Throw if the action payload is not an update with a valid key (id) */
    mustBeUpdate(action: EntityAction<Update<T>>): Update<T>;
    /** Throw if the action payload is not an array of updates with valid keys (ids) */
    mustBeUpdates(action: EntityAction<Update<T>[]>): Update<T>[];
    /** Throw if the action payload is not an update response with a valid key (id) */
    mustBeUpdateResponse(action: EntityAction<UpdateResponseData<T>>): UpdateResponseData<T>;
    /** Throw if the action payload is not an array of update responses with valid keys (ids) */
    mustBeUpdateResponses(action: EntityAction<UpdateResponseData<T>[]>): UpdateResponseData<T>[];
    private extractData;
    /** Return true if this key (id) is invalid */
    private isNotKeyType;
    private throwError;
}
