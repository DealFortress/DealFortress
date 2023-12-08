import * as i0 from '@angular/core';
import { Injectable, InjectionToken, isDevMode, Optional, Inject, ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders, NgModule } from '@angular/core';
import { filter, map, delay, timeout, catchError, shareReplay, take, mergeMap, withLatestFrom, concatMap } from 'rxjs/operators';
import * as i1 from '@angular/common/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import * as i4 from 'rxjs';
import { throwError, of, race, asyncScheduler, merge } from 'rxjs';
import { createEntityAdapter } from '@ngrx/entity';
import * as i3 from '@ngrx/store';
import { ScannedActionsSubject, createSelector, createFeatureSelector, compose, ReducerManager, combineReducers } from '@ngrx/store';
import * as i1$1 from '@ngrx/effects';
import { ofType, createEffect, EffectSources } from '@ngrx/effects';

class EntityActionFactory {
    // polymorphic create for the two signatures
    create(nameOrPayload, entityOp, data, options) {
        const payload = typeof nameOrPayload === 'string'
            ? {
                ...(options || {}),
                entityName: nameOrPayload,
                entityOp,
                data,
            }
            : nameOrPayload;
        return this.createCore(payload);
    }
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    createCore(payload) {
        const { entityName, entityOp, tag } = payload;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing EntityOp for new action');
        }
        const type = this.formatActionType(entityOp, tag || entityName);
        return { type, payload };
    }
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New EntityAction properties that replace the source action properties
     */
    createFromAction(from, newProperties) {
        return this.create({ ...from.payload, ...newProperties });
    }
    formatActionType(op, tag) {
        return `[${tag}] ${op}`;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityActionFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityActionFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityActionFactory, decorators: [{
            type: Injectable
        }] });

/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 */
class EntityActionGuard {
    constructor(entityName, selectId) {
        this.entityName = entityName;
        this.selectId = selectId;
    }
    /** Throw if the action payload is not an entity with a valid key */
    mustBeEntity(action) {
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should have a single entity.`);
        }
        const id = this.selectId(data);
        if (this.isNotKeyType(id)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return data;
    }
    /** Throw if the action payload is not an array of entities with valid keys */
    mustBeEntities(action) {
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entities`);
        }
        data.forEach((entity, i) => {
            const id = this.selectId(entity);
            if (this.isNotKeyType(id)) {
                const msg = `, item ${i + 1}, does not have a valid entity key (id)`;
                this.throwError(action, msg);
            }
        });
        return data;
    }
    /** Throw if the action payload is not a single, valid key */
    mustBeKey(action) {
        const data = this.extractData(action);
        if (data === undefined) {
            throw new Error(`should be a single entity key`);
        }
        if (this.isNotKeyType(data)) {
            throw new Error(`is not a valid key (id)`);
        }
        return data;
    }
    /** Throw if the action payload is not an array of valid keys */
    mustBeKeys(action) {
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity keys (id)`);
        }
        data.forEach((id, i) => {
            if (this.isNotKeyType(id)) {
                const msg = `${this.entityName} ', item ${i + 1}, is not a valid entity key (id)`;
                this.throwError(action, msg);
            }
        });
        return data;
    }
    /** Throw if the action payload is not an update with a valid key (id) */
    mustBeUpdate(action) {
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should be a single entity update`);
        }
        const { id, changes } = data;
        const id2 = this.selectId(changes);
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return data;
    }
    /** Throw if the action payload is not an array of updates with valid keys (ids) */
    mustBeUpdates(action) {
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity updates`);
        }
        data.forEach((item, i) => {
            const { id, changes } = item;
            const id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
            }
        });
        return data;
    }
    /** Throw if the action payload is not an update response with a valid key (id) */
    mustBeUpdateResponse(action) {
        const data = this.extractData(action);
        if (!data) {
            return this.throwError(action, `should be a single entity update`);
        }
        const { id, changes } = data;
        const id2 = this.selectId(changes);
        if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
            this.throwError(action, `has a missing or invalid entity key (id)`);
        }
        return data;
    }
    /** Throw if the action payload is not an array of update responses with valid keys (ids) */
    mustBeUpdateResponses(action) {
        const data = this.extractData(action);
        if (!Array.isArray(data)) {
            return this.throwError(action, `should be an array of entity updates`);
        }
        data.forEach((item, i) => {
            const { id, changes } = item;
            const id2 = this.selectId(changes);
            if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
                this.throwError(action, `, item ${i + 1}, has a missing or invalid entity key (id)`);
            }
        });
        return data;
    }
    extractData(action) {
        return action.payload && action.payload.data;
    }
    /** Return true if this key (id) is invalid */
    isNotKeyType(id) {
        return typeof id !== 'string' && typeof id !== 'number';
    }
    throwError(action, msg) {
        throw new Error(`${this.entityName} EntityAction guard for "${action.type}": payload ${msg}`);
    }
}

/**
 * Default function that returns the entity's primary key (pkey).
 * Assumes that the entity has an `id` pkey property.
 * Returns `undefined` if no entity or `id`.
 * Every selectId fn must return `undefined` when it cannot produce a full pkey.
 */
function defaultSelectId(entity) {
    return entity == null ? undefined : entity.id;
}
/**
 * Flatten first arg if it is an array
 * Allows fn with ...rest signature to be called with an array instead of spread
 * Example:
 * ```
 * // See entity-action-operators.ts
 * const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
 * actions.pipe(ofEntityOp(...persistOps)) // works
 * actions.pipe(ofEntityOp(persistOps)) // also works
 * ```
 * */
function flattenArgs(args) {
    if (args == null) {
        return [];
    }
    if (Array.isArray(args[0])) {
        const [head, ...tail] = args;
        args = [...head, ...tail];
    }
    return args;
}
/**
 * Return a function that converts an entity (or partial entity) into the `Update<T>`
 * whose `id` is the primary key and
 * `changes` is the entity (or partial entity of changes).
 */
function toUpdateFactory(selectId) {
    selectId = selectId || defaultSelectId;
    /**
     * Convert an entity (or partial entity) into the `Update<T>`
     * whose `id` is the primary key and
     * `changes` is the entity (or partial entity of changes).
     * @param selectId function that returns the entity's primary key (id)
     */
    return function toUpdate(entity) {
        const id = selectId(entity);
        if (id == null) {
            throw new Error('Primary key may not be null/undefined.');
        }
        return entity && { id, changes: entity };
    };
}

function ofEntityOp(...allowedEntityOps) {
    const ops = flattenArgs(allowedEntityOps);
    switch (ops.length) {
        case 0:
            return filter((action) => action.payload && action.payload.entityOp != null);
        case 1:
            const op = ops[0];
            return filter((action) => action.payload && op === action.payload.entityOp);
        default:
            return filter((action) => {
                const entityOp = action.payload && action.payload.entityOp;
                return entityOp && ops.some((o) => o === entityOp);
            });
    }
}
function ofEntityType(...allowedEntityNames) {
    const names = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter((action) => action.payload && action.payload.entityName != null);
        case 1:
            const name = names[0];
            return filter((action) => action.payload && name === action.payload.entityName);
        default:
            return filter((action) => {
                const entityName = action.payload && action.payload.entityName;
                return !!entityName && names.some((n) => n === entityName);
            });
    }
}

var ChangeSetOperation;
(function (ChangeSetOperation) {
    ChangeSetOperation["Add"] = "Add";
    ChangeSetOperation["Delete"] = "Delete";
    ChangeSetOperation["Update"] = "Update";
    ChangeSetOperation["Upsert"] = "Upsert";
})(ChangeSetOperation || (ChangeSetOperation = {}));
/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
class ChangeSetItemFactory {
    /** Create the ChangeSetAdd for new entities of the given entity type */
    add(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Add, entities };
    }
    /** Create the ChangeSetDelete for primary keys of the given entity type */
    delete(entityName, keys) {
        const ids = Array.isArray(keys)
            ? keys
            : keys
                ? [keys]
                : [];
        return { entityName, op: ChangeSetOperation.Delete, entities: ids };
    }
    /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
    update(entityName, updates) {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName, op: ChangeSetOperation.Update, entities: updates };
    }
    /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
    upsert(entityName, entities) {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: ChangeSetOperation.Upsert, entities };
    }
}
/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 */
const changeSetItemFactory = new ChangeSetItemFactory();
/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param changeSet ChangeSet with changes to filter
 */
function excludeEmptyChangeSetItems(changeSet) {
    changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
    const changes = changeSet.changes.filter((c) => c != null && c.entities && c.entities.length > 0);
    return { ...changeSet, changes };
}

/** How to merge an entity, after query or save, when the corresponding entity in the collection has unsaved changes. */
var MergeStrategy;
(function (MergeStrategy) {
    /**
     * Update the collection entities and ignore all change tracking for this operation.
     * Each entity's `changeState` is untouched.
     */
    MergeStrategy[MergeStrategy["IgnoreChanges"] = 0] = "IgnoreChanges";
    /**
     * Updates current values for unchanged entities.
     * For each changed entity it preserves the current value and overwrites the `originalValue` with the merge entity.
     * This is the query-success default.
     */
    MergeStrategy[MergeStrategy["PreserveChanges"] = 1] = "PreserveChanges";
    /**
     * Replace the current collection entities.
     * For each merged entity it discards the `changeState` and sets the `changeType` to "unchanged".
     * This is the save-success default.
     */
    MergeStrategy[MergeStrategy["OverwriteChanges"] = 2] = "OverwriteChanges";
})(MergeStrategy || (MergeStrategy = {}));

var EntityCacheAction;
(function (EntityCacheAction) {
    EntityCacheAction["CLEAR_COLLECTIONS"] = "@ngrx/data/entity-cache/clear-collections";
    EntityCacheAction["LOAD_COLLECTIONS"] = "@ngrx/data/entity-cache/load-collections";
    EntityCacheAction["MERGE_QUERY_SET"] = "@ngrx/data/entity-cache/merge-query-set";
    EntityCacheAction["SET_ENTITY_CACHE"] = "@ngrx/data/entity-cache/set-cache";
    EntityCacheAction["SAVE_ENTITIES"] = "@ngrx/data/entity-cache/save-entities";
    EntityCacheAction["SAVE_ENTITIES_CANCEL"] = "@ngrx/data/entity-cache/save-entities-cancel";
    EntityCacheAction["SAVE_ENTITIES_CANCELED"] = "@ngrx/data/entity-cache/save-entities-canceled";
    EntityCacheAction["SAVE_ENTITIES_ERROR"] = "@ngrx/data/entity-cache/save-entities-error";
    EntityCacheAction["SAVE_ENTITIES_SUCCESS"] = "@ngrx/data/entity-cache/save-entities-success";
})(EntityCacheAction || (EntityCacheAction = {}));
/**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
class ClearCollections {
    constructor(collections, tag) {
        this.type = EntityCacheAction.CLEAR_COLLECTIONS;
        this.payload = { collections, tag };
    }
}
/**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
class LoadCollections {
    constructor(collections, tag) {
        this.type = EntityCacheAction.LOAD_COLLECTIONS;
        this.payload = { collections, tag };
    }
}
/**
 * Create entity cache action that merges entities from a query result
 * that returned entities from multiple collections.
 * Corresponding entity cache reducer should add and update all collections
 * at the same time, before any selectors$ observables emit.
 * @param querySet The result of the query in the form of a map of entity collections.
 * These are the entity data to merge into the respective collections.
 * @param mergeStrategy How to merge a queried entity when it is already in the collection.
 * The default is MergeStrategy.PreserveChanges
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
class MergeQuerySet {
    constructor(querySet, mergeStrategy, tag) {
        this.type = EntityCacheAction.MERGE_QUERY_SET;
        this.payload = {
            querySet,
            mergeStrategy: mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy,
            tag,
        };
    }
}
/**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an EntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
class SetEntityCache {
    constructor(cache, tag) {
        this.cache = cache;
        this.type = EntityCacheAction.SET_ENTITY_CACHE;
        this.payload = { cache, tag };
    }
}
// #region SaveEntities
class SaveEntities {
    constructor(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = { changeSet, url, ...options, tag: changeSet.tag };
    }
}
class SaveEntitiesCancel {
    constructor(correlationId, reason, entityNames, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCEL;
        this.payload = { correlationId, reason, entityNames, tag };
    }
}
class SaveEntitiesCanceled {
    constructor(correlationId, reason, tag) {
        this.type = EntityCacheAction.SAVE_ENTITIES_CANCELED;
        this.payload = { correlationId, reason, tag };
    }
}
class SaveEntitiesError {
    constructor(error, originalAction) {
        this.type = EntityCacheAction.SAVE_ENTITIES_ERROR;
        const correlationId = originalAction.payload.correlationId;
        this.payload = { error, originalAction, correlationId };
    }
}
class SaveEntitiesSuccess {
    constructor(changeSet, url, options) {
        this.type = EntityCacheAction.SAVE_ENTITIES_SUCCESS;
        options = options || {};
        if (changeSet) {
            changeSet.tag = changeSet.tag || options.tag;
        }
        this.payload = { changeSet, url, ...options, tag: changeSet.tag };
    }
}
// #endregion SaveEntities

// Ensure that these suffix values and the EntityOp suffixes match
// Cannot do that programmatically.
/** General purpose entity action operations, good for any entity type */
var EntityOp;
(function (EntityOp) {
    // Persistance operations
    EntityOp["CANCEL_PERSIST"] = "@ngrx/data/cancel-persist";
    EntityOp["CANCELED_PERSIST"] = "@ngrx/data/canceled-persist";
    EntityOp["QUERY_ALL"] = "@ngrx/data/query-all";
    EntityOp["QUERY_ALL_SUCCESS"] = "@ngrx/data/query-all/success";
    EntityOp["QUERY_ALL_ERROR"] = "@ngrx/data/query-all/error";
    EntityOp["QUERY_LOAD"] = "@ngrx/data/query-load";
    EntityOp["QUERY_LOAD_SUCCESS"] = "@ngrx/data/query-load/success";
    EntityOp["QUERY_LOAD_ERROR"] = "@ngrx/data/query-load/error";
    EntityOp["QUERY_MANY"] = "@ngrx/data/query-many";
    EntityOp["QUERY_MANY_SUCCESS"] = "@ngrx/data/query-many/success";
    EntityOp["QUERY_MANY_ERROR"] = "@ngrx/data/query-many/error";
    EntityOp["QUERY_BY_KEY"] = "@ngrx/data/query-by-key";
    EntityOp["QUERY_BY_KEY_SUCCESS"] = "@ngrx/data/query-by-key/success";
    EntityOp["QUERY_BY_KEY_ERROR"] = "@ngrx/data/query-by-key/error";
    EntityOp["SAVE_ADD_MANY"] = "@ngrx/data/save/add-many";
    EntityOp["SAVE_ADD_MANY_ERROR"] = "@ngrx/data/save/add-many/error";
    EntityOp["SAVE_ADD_MANY_SUCCESS"] = "@ngrx/data/save/add-many/success";
    EntityOp["SAVE_ADD_ONE"] = "@ngrx/data/save/add-one";
    EntityOp["SAVE_ADD_ONE_ERROR"] = "@ngrx/data/save/add-one/error";
    EntityOp["SAVE_ADD_ONE_SUCCESS"] = "@ngrx/data/save/add-one/success";
    EntityOp["SAVE_DELETE_MANY"] = "@ngrx/data/save/delete-many";
    EntityOp["SAVE_DELETE_MANY_SUCCESS"] = "@ngrx/data/save/delete-many/success";
    EntityOp["SAVE_DELETE_MANY_ERROR"] = "@ngrx/data/save/delete-many/error";
    EntityOp["SAVE_DELETE_ONE"] = "@ngrx/data/save/delete-one";
    EntityOp["SAVE_DELETE_ONE_SUCCESS"] = "@ngrx/data/save/delete-one/success";
    EntityOp["SAVE_DELETE_ONE_ERROR"] = "@ngrx/data/save/delete-one/error";
    EntityOp["SAVE_UPDATE_MANY"] = "@ngrx/data/save/update-many";
    EntityOp["SAVE_UPDATE_MANY_SUCCESS"] = "@ngrx/data/save/update-many/success";
    EntityOp["SAVE_UPDATE_MANY_ERROR"] = "@ngrx/data/save/update-many/error";
    EntityOp["SAVE_UPDATE_ONE"] = "@ngrx/data/save/update-one";
    EntityOp["SAVE_UPDATE_ONE_SUCCESS"] = "@ngrx/data/save/update-one/success";
    EntityOp["SAVE_UPDATE_ONE_ERROR"] = "@ngrx/data/save/update-one/error";
    // Use only if the server supports upsert;
    EntityOp["SAVE_UPSERT_MANY"] = "@ngrx/data/save/upsert-many";
    EntityOp["SAVE_UPSERT_MANY_SUCCESS"] = "@ngrx/data/save/upsert-many/success";
    EntityOp["SAVE_UPSERT_MANY_ERROR"] = "@ngrx/data/save/upsert-many/error";
    // Use only if the server supports upsert;
    EntityOp["SAVE_UPSERT_ONE"] = "@ngrx/data/save/upsert-one";
    EntityOp["SAVE_UPSERT_ONE_SUCCESS"] = "@ngrx/data/save/upsert-one/success";
    EntityOp["SAVE_UPSERT_ONE_ERROR"] = "@ngrx/data/save/upsert-one/error";
    // Cache operations
    EntityOp["ADD_ALL"] = "@ngrx/data/add-all";
    EntityOp["ADD_MANY"] = "@ngrx/data/add-many";
    EntityOp["ADD_ONE"] = "@ngrx/data/add-one";
    EntityOp["REMOVE_ALL"] = "@ngrx/data/remove-all";
    EntityOp["REMOVE_MANY"] = "@ngrx/data/remove-many";
    EntityOp["REMOVE_ONE"] = "@ngrx/data/remove-one";
    EntityOp["UPDATE_MANY"] = "@ngrx/data/update-many";
    EntityOp["UPDATE_ONE"] = "@ngrx/data/update-one";
    EntityOp["UPSERT_MANY"] = "@ngrx/data/upsert-many";
    EntityOp["UPSERT_ONE"] = "@ngrx/data/upsert-one";
    EntityOp["COMMIT_ALL"] = "@ngrx/data/commit-all";
    EntityOp["COMMIT_MANY"] = "@ngrx/data/commit-many";
    EntityOp["COMMIT_ONE"] = "@ngrx/data/commit-one";
    EntityOp["UNDO_ALL"] = "@ngrx/data/undo-all";
    EntityOp["UNDO_MANY"] = "@ngrx/data/undo-many";
    EntityOp["UNDO_ONE"] = "@ngrx/data/undo-one";
    EntityOp["SET_CHANGE_STATE"] = "@ngrx/data/set-change-state";
    EntityOp["SET_COLLECTION"] = "@ngrx/data/set-collection";
    EntityOp["SET_FILTER"] = "@ngrx/data/set-filter";
    EntityOp["SET_LOADED"] = "@ngrx/data/set-loaded";
    EntityOp["SET_LOADING"] = "@ngrx/data/set-loading";
})(EntityOp || (EntityOp = {}));
/** "Success" suffix appended to EntityOps that are successful.*/
const OP_SUCCESS = '/success';
/** "Error" suffix appended to EntityOps that have failed.*/
const OP_ERROR = '/error';
/** Make the error EntityOp corresponding to the given EntityOp */
function makeErrorOp(op) {
    return (op + OP_ERROR);
}
/** Make the success EntityOp corresponding to the given EntityOp */
function makeSuccessOp(op) {
    return (op + OP_SUCCESS);
}

/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
class DataServiceError extends Error {
    constructor(error, requestData) {
        super(typeof error === 'string' ? error : extractMessage(error) ?? undefined);
        this.error = error;
        this.requestData = requestData;
        this.name = this.constructor.name;
    }
}
// Many ways the error can be shaped. These are the ways we recognize.
function extractMessage(sourceError) {
    const { error, body, message } = sourceError;
    let errMessage = null;
    if (error) {
        // prefer HttpErrorResponse.error to its message property
        errMessage = typeof error === 'string' ? error : error.message;
    }
    else if (message) {
        errMessage = message;
    }
    else if (body) {
        // try the body if no error or message property
        errMessage = typeof body === 'string' ? body : body.error;
    }
    return typeof errMessage === 'string'
        ? errMessage
        : errMessage
            ? JSON.stringify(errMessage)
            : null;
}

/**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 */
class DefaultDataServiceConfig {
}

class Logger {
}
const PLURAL_NAMES_TOKEN = new InjectionToken('@ngrx/data Plural Names');
class Pluralizer {
}

/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `DefaultHttpUrlGenerator`.
 */
class EntityHttpResourceUrls {
}
/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 */
class HttpUrlGenerator {
}
class DefaultHttpUrlGenerator {
    constructor(pluralizer) {
        this.pluralizer = pluralizer;
        /**
         * Known single-entity and collection resource URLs for HTTP calls.
         * Generator methods returns these resource URLs for a given entity type name.
         * If the resources for an entity type name are not know, it generates
         * and caches a resource name for future use
         */
        this.knownHttpResourceUrls = {};
    }
    /**
     * Get or generate the entity and collection resource URLs for the given entity type name
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     */
    getResourceUrls(entityName, root, trailingSlashEndpoints = false) {
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            const nRoot = trailingSlashEndpoints ? root : normalizeRoot(root);
            resourceUrls = {
                entityResourceUrl: `${nRoot}/${entityName}/`.toLowerCase(),
                collectionResourceUrl: `${nRoot}/${this.pluralizer.pluralize(entityName)}/`.toLowerCase(),
            };
            this.registerHttpResourceUrls({ [entityName]: resourceUrls });
        }
        return resourceUrls;
    }
    /**
     * Create the path to a single entity resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName, root, trailingSlashEndpoints) {
        return this.getResourceUrls(entityName, root, trailingSlashEndpoints)
            .entityResourceUrl;
    }
    /**
     * Create the path to a multiple entity (collection) resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/heroes'
     */
    collectionResource(entityName, root) {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    }
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     */
    registerHttpResourceUrls(entityHttpResourceUrls) {
        this.knownHttpResourceUrls = {
            ...this.knownHttpResourceUrls,
            ...(entityHttpResourceUrls || {}),
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Pluralizer }] });
/** Remove leading & trailing spaces or slashes */
function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}

/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
class DefaultDataService {
    get name() {
        return this._name;
    }
    constructor(entityName, http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.getDelay = 0;
        this.saveDelay = 0;
        this.timeout = 0;
        this.trailingSlashEndpoints = false;
        this._name = `${entityName} DefaultDataService`;
        this.entityName = entityName;
        const { root = 'api', delete404OK = true, getDelay = 0, saveDelay = 0, timeout: to = 0, trailingSlashEndpoints = false, } = config || {};
        this.delete404OK = delete404OK;
        this.entityUrl = httpUrlGenerator.entityResource(entityName, root, trailingSlashEndpoints);
        this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
        this.getDelay = getDelay;
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    add(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    delete(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to delete`);
        }
        return this.execute('DELETE', this.entityUrl + key, err, null, options).pipe(
        // forward the id of deleted entity as the result of the HTTP DELETE
        map((result) => key));
    }
    getAll(options) {
        return this.execute('GET', this.entitiesUrl, null, null, options);
    }
    getById(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to get`);
        }
        return this.execute('GET', this.entityUrl + key, err, null, options);
    }
    getWithQuery(queryParams, options) {
        const qParams = typeof queryParams === 'string'
            ? { fromString: queryParams }
            : { fromObject: queryParams };
        const params = new HttpParams(qParams);
        return this.execute('GET', this.entitiesUrl, undefined, { params }, options);
    }
    update(update, options) {
        const id = update && update.id;
        const updateOrError = id == null
            ? new Error(`No "${this.entityName}" update data or id`)
            : update.changes;
        return this.execute('PUT', this.entityUrl + id, updateOrError, null, options);
    }
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    upsert(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    execute(method, url, data, // data, error, or undefined/null
    options, // options or undefined/null
    httpOptions // these override any options passed via options
    ) {
        let entityActionHttpClientOptions = undefined;
        if (httpOptions) {
            entityActionHttpClientOptions = {
                headers: httpOptions?.httpHeaders
                    ? new HttpHeaders(httpOptions?.httpHeaders)
                    : undefined,
                params: httpOptions?.httpParams
                    ? new HttpParams(httpOptions?.httpParams)
                    : undefined,
            };
        }
        // Now we may have:
        // options: containing headers, params, or any other allowed http options already in angular's api
        // entityActionHttpClientOptions: headers and params in angular's api
        // We therefore need to merge these so that the action ones override the
        // existing keys where applicable.
        // If any options have been specified, pass them to http client. Note
        // the new http options, if specified, will override any options passed
        // from the deprecated options parameter
        let mergedOptions = undefined;
        if (options || entityActionHttpClientOptions) {
            if (isDevMode() && options && entityActionHttpClientOptions) {
                console.warn('@ngrx/data: options.httpParams will be merged with queryParams when both are are provided to getWithQuery(). In the event of a conflict HttpOptions.httpParams will override queryParams`. The queryParams parameter of getWithQuery() will be removed in next major release.');
            }
            mergedOptions = {
                ...options,
                headers: entityActionHttpClientOptions?.headers ?? options?.headers,
                params: entityActionHttpClientOptions?.params ?? options?.params,
            };
        }
        const req = {
            method,
            url,
            data,
            options: mergedOptions,
        };
        if (data instanceof Error) {
            return this.handleError(req)(data);
        }
        let result$;
        switch (method) {
            case 'DELETE': {
                result$ = this.http.delete(url, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            case 'GET': {
                result$ = this.http.get(url, mergedOptions);
                if (this.getDelay) {
                    result$ = result$.pipe(delay(this.getDelay));
                }
                break;
            }
            case 'POST': {
                result$ = this.http.post(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            // N.B.: It must return an Update<T>
            case 'PUT': {
                result$ = this.http.put(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            default: {
                const error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(error);
            }
        }
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
        }
        return result$.pipe(catchError(this.handleError(req)));
    }
    handleError(reqData) {
        return (err) => {
            const ok = this.handleDelete404(err, reqData);
            if (ok) {
                return ok;
            }
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    }
    handleDelete404(error, reqData) {
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    }
}
/**
 * Create a basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
class DefaultDataServiceFactory {
    constructor(http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.config = config;
        config = config || {};
        httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
    }
    /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @param entityName {string} Name of the entity type for this data service
     */
    create(entityName) {
        return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: HttpUrlGenerator }, { token: DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: HttpUrlGenerator }, { type: DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }] });

function createEntityDefinition(metadata) {
    let entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    const selectId = metadata.selectId || defaultSelectId;
    const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);
    const entityAdapter = createEntityAdapter({ selectId, sortComparer });
    const entityDispatcherOptions = metadata.entityDispatcherOptions || {};
    const initialState = entityAdapter.getInitialState({
        entityName,
        filter: '',
        loaded: false,
        loading: false,
        changeState: {},
        ...(metadata.additionalCollectionState || {}),
    });
    const noChangeTracking = metadata.noChangeTracking === true; // false by default
    return {
        entityName,
        entityAdapter,
        entityDispatcherOptions,
        initialState,
        metadata,
        noChangeTracking,
        selectId,
        sortComparer,
    };
}

const ENTITY_METADATA_TOKEN = new InjectionToken('@ngrx/data Entity Metadata');

/** Registry of EntityDefinitions for all cached entity types */
class EntityDefinitionService {
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

const updateOp = ChangeSetOperation.Update;
/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
class EntityCacheDataService {
    constructor(entityDefinitionService, http, config) {
        this.entityDefinitionService = entityDefinitionService;
        this.http = http;
        this.idSelectors = {};
        this.saveDelay = 0;
        this.timeout = 0;
        const { saveDelay = 0, timeout: to = 0 } = config || {};
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential SaveEntities protocol,
     * in particular the ChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param changeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param url The server endpoint that receives this request.
     */
    saveEntities(changeSet, url) {
        changeSet = this.filterChangeSet(changeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        changeSet = this.flattenUpdates(changeSet);
        let result$ = this.http
            .post(url, changeSet)
            .pipe(map((result) => this.restoreUpdates(result)), catchError(this.handleError({ method: 'POST', url, data: changeSet })));
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }
        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }
        return result$;
    }
    // #region helpers
    handleError(reqData) {
        return (err) => {
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    }
    /**
     * Filter changeSet to remove unwanted ChangeSetItems.
     * This implementation excludes null and empty ChangeSetItems.
     * @param changeSet ChangeSet with changes to filter
     */
    filterChangeSet(changeSet) {
        return excludeEmptyChangeSetItems(changeSet);
    }
    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    flattenUpdates(changeSet) {
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return {
                    ...item,
                    entities: item.entities.map((u) => u.changes),
                };
            }
            else {
                return item;
            }
        });
        return hasMutated ? { ...changeSet, changes } : changeSet;
    }
    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    restoreUpdates(changeSet) {
        if (changeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return changeSet;
        }
        let changes = changeSet.changes;
        if (changes.length === 0) {
            return changeSet;
        }
        let hasMutated = false;
        changes = changes.map((item) => {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                const selectId = this.getIdSelector(item.entityName);
                return {
                    ...item,
                    entities: item.entities.map((u) => ({
                        id: selectId(u),
                        changes: u,
                    })),
                };
            }
            else {
                return item;
            }
        });
        return hasMutated ? { ...changeSet, changes } : changeSet;
    }
    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    getIdSelector(entityName) {
        let idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector =
                this.entityDefinitionService.getDefinition(entityName).selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService, deps: [{ token: EntityDefinitionService }, { token: i1.HttpClient }, { token: DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDataService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityDefinitionService }, { type: i1.HttpClient }, { type: DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }] });

/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
class EntityDataService {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService, deps: [{ token: DefaultDataServiceFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: DefaultDataServiceFactory }] });

/**
 * Handling of responses from persistence operation
 */
class PersistenceResultHandler {
}
/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
class DefaultPersistenceResultHandler {
    constructor(logger, entityActionFactory) {
        this.logger = logger;
        this.entityActionFactory = entityActionFactory;
    }
    /** Handle successful result of persistence operation on an EntityAction */
    handleSuccess(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        return (data) => this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
            data,
        });
    }
    /** Handle error result of persistence operation on an EntityAction */
    handleError(originalAction) {
        const errorOp = makeErrorOp(originalAction.payload.entityOp);
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            const errorData = { error, originalAction };
            this.logger.error(errorData);
            const action = this.entityActionFactory.createFromAction(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, deps: [{ token: Logger }, { token: EntityActionFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Logger }, { type: EntityActionFactory }] });

/**
 * Persistence operation canceled
 */
class PersistanceCanceled {
    constructor(message) {
        this.message = message;
        this.message = message || 'Canceled by user';
    }
}

/**
 * Generates a string id beginning 'CRID',
 * followed by a monotonically increasing integer for use as a correlation id.
 * As they are produced locally by a singleton service,
 * these ids are guaranteed to be unique only
 * for the duration of a single client browser instance.
 * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
 * Do NOT use for entity keys.
 */
class CorrelationIdGenerator {
    constructor() {
        /** Seed for the ids */
        this.seed = 0;
        /** Prefix of the id, 'CRID; */
        this.prefix = 'CRID';
    }
    /** Return the next correlation id */
    next() {
        this.seed += 1;
        return this.prefix + this.seed;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator, decorators: [{
            type: Injectable
        }] });

/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
class EntityDispatcherDefaultOptions {
    constructor() {
        /** True if added entities are saved optimistically; false if saved pessimistically. */
        this.optimisticAdd = false;
        /** True if deleted entities are saved optimistically; false if saved pessimistically. */
        this.optimisticDelete = true;
        /** True if updated entities are saved optimistically; false if saved pessimistically. */
        this.optimisticUpdate = false;
        /** True if upsert entities are saved optimistically; false if saved pessimistically. */
        this.optimisticUpsert = false;
        /** True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically. */
        this.optimisticSaveEntities = false;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherDefaultOptions, decorators: [{
            type: Injectable
        }] });

/**
 * Dispatches Entity Cache actions to the EntityCache reducer
 */
class EntityCacheDispatcher {
    constructor(
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    scannedActions$, 
    /** The store, scoped to the EntityCache */
    store) {
        this.correlationIdGenerator = correlationIdGenerator;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.store = store;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    /**
     * Dispatch action to cancel the saveEntities request with matching correlation id.
     * @param correlationId The correlation id for the corresponding action
     * @param [reason] explains why canceled and by whom.
     * @param [entityNames] array of entity names so can turn off loading flag for their collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    cancelSaveEntities(correlationId, reason, entityNames, tag) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        const action = new SaveEntitiesCancel(correlationId, reason, entityNames, tag);
        this.dispatch(action);
    }
    /** Clear the named entity collections in cache
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If null/undefined/no array, clear all collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    clearCollections(collections, tag) {
        this.dispatch(new ClearCollections(collections, tag));
    }
    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param collections The collections to load, typically the result of a query.
     * @param [tag] tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    loadCollections(collections, tag) {
        this.dispatch(new LoadCollections(collections, tag));
    }
    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is MergeStrategy.PreserveChanges
     * @param [tag] tag to identify the operation from the app perspective.
     */
    mergeQuerySet(querySet, mergeStrategy, tag) {
        this.dispatch(new MergeQuerySet(querySet, mergeStrategy, tag));
    }
    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an EntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] tag to identify the operation from the app perspective.
     */
    setEntityCache(cache, tag) {
        this.dispatch(new SetEntityCache(cache, tag));
    }
    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as EntityEffects.saveEntities$.
     * Important: only call if your server supports the SaveEntities protocol
     * through your EntityDataService.saveEntities method.
     * @param changes Either the entities to save, as an array of {ChangeSetItem}, or
     * a ChangeSet that holds such changes.
     * @param url The server url which receives the save request
     * @param [options] options such as tag, correlationId, isOptimistic, and mergeStrategy.
     * These values are defaulted if not supplied.
     * @returns A terminating Observable<ChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    saveEntities(changes, url, options) {
        const changeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        const isOptimistic = options.isOptimistic == null
            ? this.defaultDispatcherOptions.optimisticSaveEntities || false
            : options.isOptimistic === true;
        const tag = options.tag || 'Save Entities';
        options = { ...options, correlationId, isOptimistic, tag };
        const action = new SaveEntities(changeSet, url, options);
        this.dispatch(action);
        return this.getSaveEntitiesResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Return Observable of data from the server-success SaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    getSaveEntitiesResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((act) => act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS ||
            act.type === EntityCacheAction.SAVE_ENTITIES_ERROR ||
            act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((act) => crid === act.payload.correlationId), take(1), mergeMap((act) => {
            return act.type === EntityCacheAction.SAVE_ENTITIES_CANCEL
                ? throwError(new PersistanceCanceled(act.payload.reason))
                : act.type === EntityCacheAction.SAVE_ENTITIES_SUCCESS
                    ? of(act.payload.changeSet)
                    : throwError(act.payload);
        }));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher, deps: [{ token: CorrelationIdGenerator }, { token: EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheDispatcher, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: CorrelationIdGenerator }, { type: EntityDispatcherDefaultOptions }, { type: i4.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: i3.Store }] });

/**
 * Dispatches EntityCollection actions to their reducers and effects (default implementation).
 * All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.
 */
class EntityDispatcherBase {
    constructor(
    /** Name of the entity type for which entities are dispatched */
    entityName, 
    /** Creates an {EntityAction} */
    entityActionFactory, 
    /** The store, scoped to the EntityCache */
    store, 
    /** Returns the primary key (id) of this entity */
    selectId = defaultSelectId, 
    /**
     * Dispatcher options configure dispatcher behavior such as
     * whether add is optimistic or pessimistic by default.
     */
    defaultDispatcherOptions, 
    /** Actions scanned by the store after it processed them with reducers. */
    reducedActions$, 
    /** Store selector for the EntityCache */
    entityCacheSelector, 
    /** Generates correlation ids for query and save methods */
    correlationIdGenerator) {
        this.entityName = entityName;
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.selectId = selectId;
        this.defaultDispatcherOptions = defaultDispatcherOptions;
        this.reducedActions$ = reducedActions$;
        this.correlationIdGenerator = correlationIdGenerator;
        this.guard = new EntityActionGuard(entityName, selectId);
        this.toUpdate = toUpdateFactory(selectId);
        const collectionSelector = createSelector(entityCacheSelector, (cache) => cache[entityName]);
        this.entityCollection$ = store.select(collectionSelector);
    }
    /**
     * Create an {EntityAction} for this entity type.
     * @param entityOp {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    createEntityAction(entityOp, data, options) {
        return this.entityActionFactory.create({
            entityName: this.entityName,
            entityOp,
            data,
            ...options,
        });
    }
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the dispatched EntityAction
     */
    createAndDispatch(op, data, options) {
        const action = this.createEntityAction(op, data, options);
        this.dispatch(action);
        return action;
    }
    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action) {
        this.store.dispatch(action);
        return action;
    }
    // #region Query and save operations
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    add(entity, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticAdd);
        const action = this.createEntityAction(EntityOp.SAVE_ADD_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(([e, collection]) => collection.entities[this.selectId(e)]), shareReplay(1));
    }
    /**
     * Dispatch action to cancel the persistence operation (query or save).
     * Will cause save observable to error with a PersistenceCancel error.
     * Caller is responsible for undoing changes in cache from pending optimistic save
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     */
    cancel(correlationId, reason, options) {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        this.createAndDispatch(EntityOp.CANCEL_PERSIST, reason, { correlationId });
    }
    delete(arg, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticDelete);
        const key = this.getKey(arg);
        const action = this.createEntityAction(EntityOp.SAVE_DELETE_ONE, key, options);
        this.guard.mustBeKey(action);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(map(() => key), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @returns A terminating Observable of the queried entities that are in the collection
     * after server reports success query or the query error.
     * @see load()
     */
    getAll(options) {
        options = this.setQueryEntityActionOptions(options);
        const action = this.createEntityAction(EntityOp.QUERY_ALL, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map(([entities, collection]) => entities.reduce((acc, e) => {
            const entity = collection.entities[this.selectId(e)];
            if (entity) {
                acc.push(entity); // only return an entity found in the collection
            }
            return acc;
        }, [])), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @returns A terminating Observable of the collection
     * after server reports successful query or the query error.
     */
    getByKey(key, options) {
        options = this.setQueryEntityActionOptions(options);
        const action = this.createEntityAction(EntityOp.QUERY_BY_KEY, key, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(([entity, collection]) => collection.entities[this.selectId(entity)]), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams, options) {
        options = this.setQueryEntityActionOptions(options);
        const action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity ids to get the entities from the collection
        // as they might be different from the entities returned from the server
        // because of unsaved changes (deletes or updates).
        withLatestFrom(this.entityCollection$), map(([entities, collection]) => entities.reduce((acc, e) => {
            const entity = collection.entities[this.selectId(e)];
            if (entity) {
                acc.push(entity); // only return an entity found in the collection
            }
            return acc;
        }, [])), shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @returns A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    load(options) {
        options = this.setQueryEntityActionOptions(options);
        const action = this.createEntityAction(EntityOp.QUERY_LOAD, null, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and completely replace the cached collection with the queried entities.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence load behavior
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    loadWithQuery(queryParams, options) {
        options = this.setQueryEntityActionOptions(options);
        const action = this.createEntityAction(EntityOp.QUERY_MANY, queryParams, options);
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(shareReplay(1));
    }
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @returns A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        const update = this.toUpdate(entity);
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpdate);
        const action = this.createEntityAction(EntityOp.SAVE_UPDATE_ONE, update, options);
        if (options.isOptimistic) {
            this.guard.mustBeUpdate(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the update entity data id to get the entity from the collection
        // as might be different from the entity returned from the server
        // because the id changed or there are unsaved changes.
        map((updateData) => updateData.changes), withLatestFrom(this.entityCollection$), map(([e, collection]) => collection.entities[this.selectId(e)]), shareReplay(1));
    }
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity, options) {
        options = this.setSaveEntityActionOptions(options, this.defaultDispatcherOptions.optimisticUpsert);
        const action = this.createEntityAction(EntityOp.SAVE_UPSERT_ONE, entity, options);
        if (options.isOptimistic) {
            this.guard.mustBeEntity(action);
        }
        this.dispatch(action);
        return this.getResponseData$(options.correlationId).pipe(
        // Use the returned entity data's id to get the entity from the collection
        // as it might be different from the entity returned from the server.
        withLatestFrom(this.entityCollection$), map(([e, collection]) => collection.entities[this.selectId(e)]), shareReplay(1));
    }
    // #endregion Query and save operations
    // #region Cache-only operations that do not update remote storage
    // Unguarded for performance.
    // EntityCollectionReducer<T> runs a guard (which throws)
    // Developer should understand cache-only methods well enough
    // to call them with the proper entities.
    // May reconsider and add guards in future.
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     */
    addAllToCache(entities, options) {
        this.createAndDispatch(EntityOp.ADD_ALL, entities, options);
    }
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     */
    addOneToCache(entity, options) {
        this.createAndDispatch(EntityOp.ADD_ONE, entity, options);
    }
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     */
    addManyToCache(entities, options) {
        this.createAndDispatch(EntityOp.ADD_MANY, entities, options);
    }
    /** Clear the cached entity collection */
    clearCache(options) {
        this.createAndDispatch(EntityOp.REMOVE_ALL, undefined, options);
    }
    removeOneFromCache(arg, options) {
        this.createAndDispatch(EntityOp.REMOVE_ONE, this.getKey(arg), options);
    }
    removeManyFromCache(args, options) {
        if (!args || args.length === 0) {
            return;
        }
        const keys = typeof args[0] === 'object'
            ? // if array[0] is a key, assume they're all keys
                args.map((arg) => this.getKey(arg))
            : args;
        this.createAndDispatch(EntityOp.REMOVE_MANY, keys, options);
    }
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     */
    updateOneInCache(entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        const update = this.toUpdate(entity);
        this.createAndDispatch(EntityOp.UPDATE_ONE, update, options);
    }
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     */
    updateManyInCache(entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        const updates = entities.map((entity) => this.toUpdate(entity));
        this.createAndDispatch(EntityOp.UPDATE_MANY, updates, options);
    }
    /**
     * Add or update a new entity directly to the cache.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload
     */
    upsertOneInCache(entity, options) {
        this.createAndDispatch(EntityOp.UPSERT_ONE, entity, options);
    }
    /**
     * Add or update multiple cached entities directly.
     * Does not save to remote storage.
     */
    upsertManyInCache(entities, options) {
        if (!entities || entities.length === 0) {
            return;
        }
        this.createAndDispatch(EntityOp.UPSERT_MANY, entities, options);
    }
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    setFilter(pattern) {
        this.createAndDispatch(EntityOp.SET_FILTER, pattern);
    }
    /** Set the loaded flag */
    setLoaded(isLoaded) {
        this.createAndDispatch(EntityOp.SET_LOADED, !!isLoaded);
    }
    /** Set the loading flag */
    setLoading(isLoading) {
        this.createAndDispatch(EntityOp.SET_LOADING, !!isLoading);
    }
    // #endregion Cache-only operations that do not update remote storage
    // #region private helpers
    /** Get key from entity (unless arg is already a key) */
    getKey(arg) {
        return typeof arg === 'object'
            ? this.selectId(arg)
            : arg;
    }
    /**
     * Return Observable of data from the server-success EntityAction with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    getResponseData$(crid) {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(filter((act) => !!act.payload), filter((act) => {
            const { correlationId, entityName, entityOp } = act.payload;
            return (entityName === this.entityName &&
                correlationId === crid &&
                (entityOp.endsWith(OP_SUCCESS) ||
                    entityOp.endsWith(OP_ERROR) ||
                    entityOp === EntityOp.CANCEL_PERSIST));
        }), take(1), mergeMap((act) => {
            const { entityOp } = act.payload;
            return entityOp === EntityOp.CANCEL_PERSIST
                ? throwError(new PersistanceCanceled(act.payload.data))
                : entityOp.endsWith(OP_SUCCESS)
                    ? of(act.payload.data)
                    : throwError(act.payload.data.error);
        }));
    }
    setQueryEntityActionOptions(options) {
        options = options || {};
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        return { ...options, correlationId };
    }
    setSaveEntityActionOptions(options, defaultOptimism) {
        options = options || {};
        const correlationId = options.correlationId == null
            ? this.correlationIdGenerator.next()
            : options.correlationId;
        const isOptimistic = options.isOptimistic == null
            ? defaultOptimism || false
            : options.isOptimistic === true;
        return { ...options, correlationId, isOptimistic };
    }
}

const ENTITY_CACHE_NAME = 'entityCache';
const ENTITY_CACHE_NAME_TOKEN = new InjectionToken('@ngrx/data Entity Cache Name');
const ENTITY_CACHE_META_REDUCERS = new InjectionToken('@ngrx/data Entity Cache Meta Reducers');
const ENTITY_COLLECTION_META_REDUCERS = new InjectionToken('@ngrx/data Entity Collection Meta Reducers');
const INITIAL_ENTITY_CACHE_STATE = new InjectionToken('@ngrx/data Initial Entity Cache State');

const ENTITY_CACHE_SELECTOR_TOKEN = new InjectionToken('@ngrx/data Entity Cache Selector');
const entityCacheSelectorProvider = {
    provide: ENTITY_CACHE_SELECTOR_TOKEN,
    useFactory: createEntityCacheSelector,
    deps: [[new Optional(), ENTITY_CACHE_NAME_TOKEN]],
};
function createEntityCacheSelector(entityCacheName) {
    entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
    return createFeatureSelector(entityCacheName);
}

/** Creates EntityDispatchers for entity collections */
class EntityDispatcherFactory {
    constructor(entityActionFactory, store, entityDispatcherDefaultOptions, scannedActions$, entityCacheSelector, correlationIdGenerator) {
        this.entityActionFactory = entityActionFactory;
        this.store = store;
        this.entityDispatcherDefaultOptions = entityDispatcherDefaultOptions;
        this.entityCacheSelector = entityCacheSelector;
        this.correlationIdGenerator = correlationIdGenerator;
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }
    /**
     * Create an `EntityDispatcher` for an entity type `T` and store.
     */
    create(
    /** Name of the entity type */
    entityName, 
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     * @param {IdSelector<T>} selectId
     */
    selectId = defaultSelectId, 
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     * @param {Partial<EntityDispatcherDefaultOptions>} defaultOptions
     */
    defaultOptions = {}) {
        // merge w/ defaultOptions with injected defaults
        const options = {
            ...this.entityDispatcherDefaultOptions,
            ...defaultOptions,
        };
        return new EntityDispatcherBase(entityName, this.entityActionFactory, this.store, selectId, options, this.reducedActions$, this.entityCacheSelector, this.correlationIdGenerator);
    }
    ngOnDestroy() {
        this.raSubscription.unsubscribe();
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory, deps: [{ token: EntityActionFactory }, { token: i3.Store }, { token: EntityDispatcherDefaultOptions }, { token: ScannedActionsSubject }, { token: ENTITY_CACHE_SELECTOR_TOKEN }, { token: CorrelationIdGenerator }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDispatcherFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityActionFactory }, { type: i3.Store }, { type: EntityDispatcherDefaultOptions }, { type: i4.Observable, decorators: [{
                    type: Inject,
                    args: [ScannedActionsSubject]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }, { type: CorrelationIdGenerator }] });

// See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
/** Token to inject a special RxJS Scheduler during marble tests. */
const ENTITY_EFFECTS_SCHEDULER = new InjectionToken('@ngrx/data Entity Effects Scheduler');

class EntityCacheEffects {
    constructor(actions, dataService, entityActionFactory, logger, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.logger = logger;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
         */
        this.saveEntitiesCancel$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL), filter((a) => a.payload.correlationId != null)), { dispatch: false });
        // Concurrent persistence requests considered unsafe.
        // `mergeMap` allows for concurrent requests which may return in any order
        this.saveEntities$ = createEffect(() => this.actions.pipe(ofType(EntityCacheAction.SAVE_ENTITIES), mergeMap((action) => this.saveEntities(action))));
    }
    /**
     * Perform the requested SaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The SaveEntities action
     */
    saveEntities(action) {
        const error = action.payload.error;
        if (error) {
            return this.handleSaveEntitiesError$(action)(error);
        }
        try {
            const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };
            if (changeSet.changes.length === 0) {
                // nothing to save
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.saveEntitiesCancel$.pipe(filter((a) => correlationId === a.payload.correlationId), map((a) => new SaveEntitiesCanceled(correlationId, a.payload.reason, a.payload.tag)));
            // Data: SaveEntities result as a SaveEntitiesSuccess action
            const d = this.dataService.saveEntities(changeSet, url).pipe(concatMap((result) => this.handleSaveEntitiesSuccess$(action, this.entityActionFactory)(result)), catchError(this.handleSaveEntitiesError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleSaveEntitiesError$(action)(err);
        }
    }
    /** return handler of error result of saveEntities, returning a scalar observable of error action */
    handleSaveEntitiesError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err) => {
            const error = err instanceof DataServiceError ? err : new DataServiceError(err, null);
            return of(new SaveEntitiesError(error, action)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
        };
    }
    /** return handler of the ChangeSet result of successful saveEntities() */
    handleSaveEntitiesSuccess$(action, entityActionFactory) {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };
        return (changeSet) => {
            // DataService returned a ChangeSet with possible updates to the saved entities
            if (changeSet) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // No ChangeSet = Server probably responded '204 - No Content' because
            // it made no changes to the inserted/updated entities.
            // Respond with success action best on the ChangeSet in the request.
            changeSet = action.payload.changeSet;
            // If pessimistic save, return success action with the original ChangeSet
            if (!action.payload.isOptimistic) {
                return of(new SaveEntitiesSuccess(changeSet, url, options));
            }
            // If optimistic save, avoid cache grinding by just turning off the loading flags
            // for all collections in the original ChangeSet
            const entityNames = changeSet.changes.reduce((acc, item) => acc.indexOf(item.entityName) === -1
                ? acc.concat(item.entityName)
                : acc, []);
            return merge(entityNames.map((name) => entityActionFactory.create(name, EntityOp.SET_LOADING, false)));
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects, deps: [{ token: i1$1.Actions }, { token: EntityCacheDataService }, { token: EntityActionFactory }, { token: Logger }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheEffects, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1$1.Actions }, { type: EntityCacheDataService }, { type: EntityActionFactory }, { type: Logger }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }] });

const persistOps = [
    EntityOp.QUERY_ALL,
    EntityOp.QUERY_LOAD,
    EntityOp.QUERY_BY_KEY,
    EntityOp.QUERY_MANY,
    EntityOp.SAVE_ADD_ONE,
    EntityOp.SAVE_DELETE_ONE,
    EntityOp.SAVE_UPDATE_ONE,
    EntityOp.SAVE_UPSERT_ONE,
];
class EntityEffects {
    constructor(actions, dataService, entityActionFactory, resultHandler, 
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    scheduler) {
        this.actions = actions;
        this.dataService = dataService;
        this.entityActionFactory = entityActionFactory;
        this.resultHandler = resultHandler;
        this.scheduler = scheduler;
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
        this.responseDelay = 10;
        /**
         * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
         */
        this.cancel$ = createEffect(() => this.actions.pipe(ofEntityOp(EntityOp.CANCEL_PERSIST), map((action) => action.payload.correlationId), filter((id) => id != null)), { dispatch: false });
        // `mergeMap` allows for concurrent requests which may return in any order
        this.persist$ = createEffect(() => this.actions.pipe(ofEntityOp(persistOps), mergeMap((action) => this.persist(action))));
    }
    /**
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation EntityAction
     */
    persist(action) {
        if (action.payload.skip) {
            // Should not persist. Pretend it succeeded.
            return this.handleSkipSuccess$(action);
        }
        if (action.payload.error) {
            return this.handleError$(action)(action.payload.error);
        }
        try {
            // Cancellation: returns Observable of CANCELED_PERSIST for a persistence EntityAction
            // whose correlationId matches cancellation correlationId
            const c = this.cancel$.pipe(filter((id) => action.payload.correlationId === id), map((id) => this.entityActionFactory.createFromAction(action, {
                entityOp: EntityOp.CANCELED_PERSIST,
            })));
            // Data: entity collection DataService result as a successful persistence EntityAction
            const d = this.callDataService(action).pipe(map(this.resultHandler.handleSuccess(action)), catchError(this.handleError$(action)));
            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        }
        catch (err) {
            return this.handleError$(action)(err);
        }
    }
    callDataService(action) {
        const { entityName, entityOp, data, httpOptions } = action.payload;
        const service = this.dataService.getService(entityName);
        switch (entityOp) {
            case EntityOp.QUERY_ALL:
            case EntityOp.QUERY_LOAD:
                return service.getAll(httpOptions);
            case EntityOp.QUERY_BY_KEY:
                return service.getById(data, httpOptions);
            case EntityOp.QUERY_MANY:
                return service.getWithQuery(data, httpOptions);
            case EntityOp.SAVE_ADD_ONE:
                return service.add(data, httpOptions);
            case EntityOp.SAVE_DELETE_ONE:
                return service.delete(data, httpOptions);
            case EntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data; // data must be Update<T>
                return service.update(data, httpOptions).pipe(map((updatedEntity) => {
                    // Return an Update<T> with updated entity data.
                    // If server returned entity data, merge with the changes that were sent
                    // and set the 'changed' flag to true.
                    // If server did not return entity data,
                    // assume it made no additional changes of its own, return the original changes,
                    // and set the `changed` flag to `false`.
                    const hasData = updatedEntity && Object.keys(updatedEntity).length > 0;
                    const responseData = hasData
                        ? { id, changes: { ...changes, ...updatedEntity }, changed: true }
                        : { id, changes, changed: false };
                    return responseData;
                }));
            case EntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data, httpOptions).pipe(map((upsertedEntity) => {
                    const hasData = upsertedEntity && Object.keys(upsertedEntity).length > 0;
                    return hasData ? upsertedEntity : data; // ensure a returned entity value.
                }));
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented.`);
        }
    }
    /**
     * Handle error result of persistence operation on an EntityAction,
     * returning a scalar observable of error action
     */
    handleError$(action) {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (error) => of(this.resultHandler.handleError(action)(error)).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /**
     * Because EntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     */
    handleSkipSuccess$(originalAction) {
        const successOp = makeSuccessOp(originalAction.payload.entityOp);
        const successAction = this.entityActionFactory.createFromAction(originalAction, {
            entityOp: successOp,
        });
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(delay(this.responseDelay, this.scheduler || asyncScheduler));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects, deps: [{ token: i1$1.Actions }, { token: EntityDataService }, { token: EntityActionFactory }, { token: PersistenceResultHandler }, { token: ENTITY_EFFECTS_SCHEDULER, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityEffects, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1$1.Actions }, { type: EntityDataService }, { type: EntityActionFactory }, { type: PersistenceResultHandler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_EFFECTS_SCHEDULER]
                }] }] });

/**
 * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
 * anywhere in any of the given props of an entity.
 * If pattern is a string, spaces are significant and ignores case.
 */
function PropsFilterFnFactory(props = []) {
    if (props.length === 0) {
        // No properties -> nothing could match -> return unfiltered
        return (entities, pattern) => entities;
    }
    return (entities, pattern) => {
        if (!entities) {
            return [];
        }
        const regExp = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
        if (regExp) {
            const predicate = (e) => props.some((prop) => regExp.test(e[prop]));
            return entities.filter(predicate);
        }
        return entities;
    };
}

/**
 * Base class for a concrete EntityCollectionService<T>.
 * Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.
 * @param EntityCollectionServiceElements The ingredients for this service
 * as a source of supporting services for creating an EntityCollectionService<T> instance.
 */
class EntityCollectionServiceBase {
    constructor(
    /** Name of the entity type of this collection service */
    entityName, 
    /** Creates the core elements of the EntityCollectionService for this entity type */
    serviceElementsFactory) {
        this.entityName = entityName;
        entityName = entityName.trim();
        const { dispatcher, selectors, selectors$ } = serviceElementsFactory.create(entityName);
        this.entityName = entityName;
        this.dispatcher = dispatcher;
        this.guard = dispatcher.guard;
        this.selectId = dispatcher.selectId;
        this.toUpdate = dispatcher.toUpdate;
        this.selectors = selectors;
        this.selectors$ = selectors$;
        this.collection$ = selectors$.collection$;
        this.count$ = selectors$.count$;
        this.entities$ = selectors$.entities$;
        this.entityActions$ = selectors$.entityActions$;
        this.entityMap$ = selectors$.entityMap$;
        this.errors$ = selectors$.errors$;
        this.filter$ = selectors$.filter$;
        this.filteredEntities$ = selectors$.filteredEntities$;
        this.keys$ = selectors$.keys$;
        this.loaded$ = selectors$.loaded$;
        this.loading$ = selectors$.loading$;
        this.changeState$ = selectors$.changeState$;
    }
    /**
     * Create an {EntityAction} for this entity type.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the EntityAction
     */
    createEntityAction(op, data, options) {
        return this.dispatcher.createEntityAction(op, data, options);
    }
    /**
     * Create an {EntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @param op {EntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the dispatched EntityAction
     */
    createAndDispatch(op, data, options) {
        return this.dispatcher.createAndDispatch(op, data, options);
    }
    /**
     * Dispatch an action of any type to the ngrx store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action) {
        return this.dispatcher.dispatch(action);
    }
    /** The NgRx Store for the {EntityCache} */
    get store() {
        return this.dispatcher.store;
    }
    add(entity, options) {
        return this.dispatcher.add(entity, options);
    }
    /**
     * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
     * @param correlationId The correlation id for the corresponding EntityAction
     * @param [reason] explains why canceled and by whom.
     * @param [options] options such as the tag and mergeStrategy
     */
    cancel(correlationId, reason, options) {
        this.dispatcher.cancel(correlationId, reason, options);
    }
    delete(arg, options) {
        return this.dispatcher.delete(arg, options);
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @param [options] options that influence merge behavior
     * @returns Observable of the collection
     * after server reports successful query or the query error.
     * @see load()
     */
    getAll(options) {
        return this.dispatcher.getAll(options);
    }
    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param key The primary key of the entity to get.
     * @param [options] options that influence merge behavior
     * @returns Observable of the queried entity that is in the collection
     * after server reports success or the query error.
     */
    getByKey(key, options) {
        return this.dispatcher.getByKey(key, options);
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence merge behavior
     * @returns Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(queryParams, options) {
        return this.dispatcher.getWithQuery(queryParams, options);
    }
    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @param [options] options that influence load behavior
     * @returns Observable of the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    load(options) {
        return this.dispatcher.load(options);
    }
    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and completely replace the cached collection with the queried entities.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence load behavior
     * @returns Observable of the queried entities
     * after server reports successful query or the query error.
     */
    loadWithQuery(queryParams, options) {
        return this.dispatcher.loadWithQuery(queryParams, options);
    }
    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity, options) {
        return this.dispatcher.update(entity, options);
    }
    /**
     * Dispatch action to save a new or existing entity to remote storage.
     * Call only if the server supports upsert.
     * @param entity entity to add or upsert.
     * It may omit its key if an add, and is pessimistic, and the server creates the key;
     * must have a key if optimistic save.
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity, options) {
        return this.dispatcher.upsert(entity, options);
    }
    /*** Cache-only operations that do not update remote storage ***/
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addAllToCache(entities, options) {
        this.dispatcher.addAllToCache(entities, options);
    }
    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param entity to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addOneToCache(entity, options) {
        this.dispatcher.addOneToCache(entity, options);
    }
    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addManyToCache(entities, options) {
        this.dispatcher.addManyToCache(entities, options);
    }
    /** Clear the cached entity collection */
    clearCache() {
        this.dispatcher.clearCache();
    }
    removeOneFromCache(arg, options) {
        this.dispatcher.removeOneFromCache(arg, options);
    }
    removeManyFromCache(args, options) {
        this.dispatcher.removeManyFromCache(args, options);
    }
    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateOneInCache(entity, options) {
        // update entity might be a partial of T but must at least have its key.
        // pass the Update<T> structure as the payload
        this.dispatcher.updateOneInCache(entity, options);
    }
    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param entities to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateManyInCache(entities, options) {
        this.dispatcher.updateManyInCache(entities, options);
    }
    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload.
     * @param entity to upsert directly in cache.
     * @param [options] options such as mergeStrategy
     */
    upsertOneInCache(entity, options) {
        this.dispatcher.upsertOneInCache(entity, options);
    }
    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload.
     * @param entities to upsert directly in cache.
     * @param [options] options such as mergeStrategy
     */
    upsertManyInCache(entities, options) {
        this.dispatcher.upsertManyInCache(entities, options);
    }
    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    setFilter(pattern) {
        this.dispatcher.setFilter(pattern);
    }
    /** Set the loaded flag */
    setLoaded(isLoaded) {
        this.dispatcher.setLoaded(!!isLoaded);
    }
    /** Set the loading flag */
    setLoading(isLoading) {
        this.dispatcher.setLoading(!!isLoading);
    }
}

class EntityCollectionCreator {
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /**
     * Create the default collection for an entity type.
     * @param entityName {string} entity type name
     */
    create(entityName) {
        const def = this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition(entityName, false /*shouldThrow*/);
        const initialState = def && def.initialState;
        return (initialState || createEmptyEntityCollection(entityName));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator, deps: [{ token: EntityDefinitionService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityDefinitionService, decorators: [{
                    type: Optional
                }] }] });
function createEmptyEntityCollection(entityName) {
    return {
        entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    };
}

/** Creates EntitySelector functions for entity collections. */
class EntitySelectorsFactory {
    constructor(entityCollectionCreator, selectEntityCache) {
        this.entityCollectionCreator =
            entityCollectionCreator || new EntityCollectionCreator();
        this.selectEntityCache =
            selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
    }
    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @param entityName the name of the collection
     */
    createCollectionSelector(entityName) {
        const getCollection = (cache = {}) => ((cache[entityName] ||
            this.entityCollectionCreator.create(entityName)));
        return createSelector(this.selectEntityCache, getCollection);
    }
    // createCollectionSelectors implementation
    createCollectionSelectors(metadataOrName) {
        const metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        const selectKeys = (c) => c.ids;
        const selectEntityMap = (c) => c.entities;
        const selectEntities = createSelector(selectKeys, selectEntityMap, (keys, entities) => keys.map((key) => entities[key]));
        const selectCount = createSelector(selectKeys, (keys) => keys.length);
        // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
        const selectFilter = (c) => c.filter;
        const filterFn = metadata.filterFn;
        const selectFilteredEntities = filterFn
            ? createSelector(selectEntities, selectFilter, (entities, pattern) => filterFn(entities, pattern))
            : selectEntities;
        const selectLoaded = (c) => c.loaded;
        const selectLoading = (c) => c.loading;
        const selectChangeState = (c) => c.changeState;
        // Create collection selectors for each `additionalCollectionState` property.
        // These all extend from `selectCollection`
        const extra = metadata.additionalCollectionState || {};
        const extraSelectors = {};
        Object.keys(extra).forEach((k) => {
            extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = (c) => c[k];
        });
        return {
            selectCount,
            selectEntities,
            selectEntityMap,
            selectFilter,
            selectFilteredEntities,
            selectKeys,
            selectLoaded,
            selectLoading,
            selectChangeState,
            ...extraSelectors,
        };
    }
    // createCollectionSelectors implementation
    create(metadataOrName) {
        const metadata = typeof metadataOrName === 'string'
            ? { entityName: metadataOrName }
            : metadataOrName;
        const entityName = metadata.entityName;
        const selectCollection = this.createCollectionSelector(entityName);
        const collectionSelectors = this.createCollectionSelectors(metadata);
        const entitySelectors = {};
        Object.keys(collectionSelectors).forEach((k) => {
            entitySelectors[k] = createSelector(selectCollection, collectionSelectors[k]);
        });
        return {
            entityName,
            selectCollection,
            selectEntityCache: this.selectEntityCache,
            ...entitySelectors,
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectorsFactory, deps: [{ token: EntityCollectionCreator, optional: true }, { token: ENTITY_CACHE_SELECTOR_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectorsFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectorsFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionCreator, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }] });

/** Creates observable EntitySelectors$ for entity collections. */
class EntitySelectors$Factory {
    constructor(store, actions, selectEntityCache) {
        this.store = store;
        this.actions = actions;
        this.selectEntityCache = selectEntityCache;
        // This service applies to the cache in ngrx/store named `cacheName`
        this.entityCache$ = this.store.select(this.selectEntityCache);
        this.entityActionErrors$ = actions.pipe(filter((ea) => ea.payload &&
            ea.payload.entityOp &&
            ea.payload.entityOp.endsWith(OP_ERROR)), shareReplay(1));
    }
    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @param entityName - is also the name of the collection.
     * @param selectors - selector functions for this collection.
     **/
    create(entityName, selectors) {
        const selectors$ = {
            entityName,
        };
        Object.keys(selectors).forEach((name) => {
            if (name.startsWith('select')) {
                // strip 'select' prefix from the selector fn name and append `$`
                // Ex: 'selectEntities' => 'entities$'
                const name$ = name[6].toLowerCase() + name.substring(7) + '$';
                selectors$[name$] = this.store.select(selectors[name]);
            }
        });
        selectors$['entityActions$'] = this.actions.pipe(ofEntityType(entityName));
        selectors$['errors$'] = this.entityActionErrors$.pipe(ofEntityType(entityName));
        return selectors$;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectors$Factory, deps: [{ token: i3.Store }, { token: i1$1.Actions }, { token: ENTITY_CACHE_SELECTOR_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectors$Factory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntitySelectors$Factory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i3.Store }, { type: i1$1.Actions }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ENTITY_CACHE_SELECTOR_TOKEN]
                }] }] });

/** Creates the core elements of the EntityCollectionService for an entity type. */
class EntityCollectionServiceElementsFactory {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, deps: [{ token: EntityDispatcherFactory }, { token: EntityDefinitionService }, { token: EntitySelectorsFactory }, { token: EntitySelectors$Factory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceElementsFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityDispatcherFactory }, { type: EntityDefinitionService }, { type: EntitySelectorsFactory }, { type: EntitySelectors$Factory }] });

/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
class EntityCollectionServiceFactory {
    constructor(
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    entityCollectionServiceElementsFactory) {
        this.entityCollectionServiceElementsFactory = entityCollectionServiceElementsFactory;
    }
    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    create(entityName) {
        return new EntityCollectionServiceBase(entityName, this.entityCollectionServiceElementsFactory);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory, deps: [{ token: EntityCollectionServiceElementsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionServiceElementsFactory }] });

/** Core ingredients of an EntityServices class */
class EntityServicesElements {
    constructor(
    /**
     * Creates EntityCollectionService instances for
     * a cached collection of T entities in the ngrx store.
     */
    entityCollectionServiceFactory, 
    /** Creates EntityDispatchers for entity collections */
    entityDispatcherFactory, 
    /** Creates observable EntitySelectors$ for entity collections. */
    entitySelectors$Factory, 
    /** The ngrx store, scoped to the EntityCache */
    store) {
        this.entityCollectionServiceFactory = entityCollectionServiceFactory;
        this.store = store;
        this.entityActionErrors$ = entitySelectors$Factory.entityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements, deps: [{ token: EntityCollectionServiceFactory }, { token: EntityDispatcherFactory }, { token: EntitySelectors$Factory }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesElements, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionServiceFactory }, { type: EntityDispatcherFactory }, { type: EntitySelectors$Factory }, { type: i3.Store }] });

/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @usageNotes
 * ```ts
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 * ```
 */
class EntityServicesBase {
    // Dear @ngrx/data developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    constructor(entityServicesElements) {
        this.entityServicesElements = entityServicesElements;
        /** Registry of EntityCollectionService instances */
        this.EntityCollectionServices = {};
    }
    // #region EntityServicesElement-based properties
    /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    get entityActionErrors$() {
        return this.entityServicesElements.entityActionErrors$;
    }
    /** Observable of the entire entity cache */
    get entityCache$() {
        return this.entityServicesElements.entityCache$;
    }
    /** Factory to create a default instance of an EntityCollectionService */
    get entityCollectionServiceFactory() {
        return this.entityServicesElements.entityCollectionServiceFactory;
    }
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    get reducedActions$() {
        return this.entityServicesElements.reducedActions$;
    }
    /** The ngrx store, scoped to the EntityCache */
    get store() {
        return this.entityServicesElements.store;
    }
    // #endregion EntityServicesElement-based properties
    /** Dispatch any action to the store */
    dispatch(action) {
        this.store.dispatch(action);
    }
    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    createEntityCollectionService(entityName) {
        return this.entityCollectionServiceFactory.create(entityName);
    }
    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    getEntityCollectionService(entityName) {
        let service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    }
    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    registerEntityCollectionService(service, serviceName) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    }
    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    registerEntityCollectionServices(entityCollectionServices) {
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach((service) => this.registerEntityCollectionService(service));
        }
        else {
            Object.keys(entityCollectionServices || {}).forEach((serviceName) => {
                this.registerEntityCollectionService(entityCollectionServices[serviceName], serviceName);
            });
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase, deps: [{ token: EntityServicesElements }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityServicesBase, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityServicesElements }] });

/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 */
class EntityServices {
}

/** Types of change in a ChangeState instance */
var ChangeType;
(function (ChangeType) {
    /** The entity has not changed from its last known server state. */
    ChangeType[ChangeType["Unchanged"] = 0] = "Unchanged";
    /** The entity was added to the collection */
    ChangeType[ChangeType["Added"] = 1] = "Added";
    /** The entity is scheduled for delete and was removed from the collection */
    ChangeType[ChangeType["Deleted"] = 2] = "Deleted";
    /** The entity in the collection was updated */
    ChangeType[ChangeType["Updated"] = 3] = "Updated";
})(ChangeType || (ChangeType = {}));

/**
 * The default implementation of EntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by EntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See EntityChangeTracker docs.
 */
class EntityChangeTrackerBase {
    constructor(adapter, selectId) {
        this.adapter = adapter;
        this.selectId = selectId;
        /** Extract the primary key (id); default to `id` */
        this.selectId = selectId || defaultSelectId;
    }
    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param collection The entity collection
     */
    commitAll(collection) {
        return Object.keys(collection.changeState).length === 0
            ? collection
            : { ...collection, changeState: {} };
    }
    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param entityOrIdList The entities to clear tracking or their ids.
     * @param collection The entity collection
     */
    commitMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        let didMutate = false;
        const changeState = entityOrIdList.reduce((chgState, entityOrId) => {
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : entityOrId;
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = { ...chgState };
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    commitOne(entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.commitMany([entityOrId], collection);
    }
    // #endregion commit methods
    // #region merge query
    /**
     * Merge query results into the collection, adjusting the ChangeState per the mergeStrategy.
     * @param entities Entities returned from querying the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.PreserveChanges.
     * @returns The merged EntityCollection.
     */
    mergeQueryResults(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.PreserveChanges, mergeStrategy);
    }
    // #endregion merge query results
    // #region merge save results
    /**
     * Merge result of saving new entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving new entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveAdds(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the MergeStrategy is ignoreChanges.
     * @param entities keys primary keys of the entities to remove/delete.
     * @param collection The entity collection
     * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveDeletes(keys, collection, mergeStrategy) {
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        const deleteIds = keys; // make TypeScript happy
        collection =
            mergeStrategy === MergeStrategy.IgnoreChanges
                ? collection
                : this.commitMany(deleteIds, collection);
        return this.adapter.removeMany(deleteIds, collection);
    }
    /**
     * Merge result of saving updated entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param updateResponseData Entity response data returned from saving updated entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
     * If the update was optimistic and the server didn't make more changes of its own
     * then the updates are already in the collection and shouldn't make them again.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpdates(updateResponseData, collection, mergeStrategy, skipUnchanged = false) {
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }
        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? MergeStrategy.OverwriteChanges : mergeStrategy;
        let updates;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.OverwriteChanges:
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? { ...collection, changeState } : collection;
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);
            case MergeStrategy.PreserveChanges: {
                const updateableEntities = [];
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        const newId = this.selectId(update.changes);
                        const oldChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        const newOrigValue = {
                            ...oldChangeState.originalValue,
                            ...update.changes,
                        };
                        chgState[newId] = {
                            ...oldChangeState,
                            originalValue: newOrigValue,
                        };
                    }
                    else {
                        updateableEntities.push(update);
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? { ...collection, changeState } : collection;
                updates = filterChanged(updateableEntities);
                return this.adapter.updateMany(updates, collection);
            }
        }
        /**
         * Conditionally keep only those updates that have additional server changes.
         * (e.g., for optimistic saves because they updates are already in the current collection)
         * Strip off the `changed` property.
         * @responseData Entity response data from server.
         * May be an UpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
         * @returns Update<T> (without the changed flag)
         */
        function filterChanged(responseData) {
            if (skipUnchanged === true) {
                // keep only those updates that the server changed (knowable if is UpdateResponseData<T>)
                responseData = responseData.filter((r) => r.changed === true);
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map((r) => ({ id: r.id, changes: r.changes }));
        }
    }
    /**
     * Merge result of saving upserted entities into the collection, adjusting the ChangeState per the mergeStrategy.
     * The default is MergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving upserts to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to MergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpserts(entities, collection, mergeStrategy) {
        return this.mergeServerUpserts(entities, collection, MergeStrategy.OverwriteChanges, mergeStrategy);
    }
    // #endregion merge save results
    // #region query & save helpers
    /**
     *
     * @param entities Entities to merge
     * @param collection Collection into which entities are merged
     * @param defaultMergeStrategy How to merge when action's MergeStrategy is unspecified
     * @param [mergeStrategy] The action's MergeStrategy
     */
    mergeServerUpserts(entities, collection, defaultMergeStrategy, mergeStrategy) {
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }
        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? defaultMergeStrategy : mergeStrategy;
        switch (mergeStrategy) {
            case MergeStrategy.IgnoreChanges:
                return this.adapter.upsertMany(entities, collection);
            case MergeStrategy.OverwriteChanges:
                collection = this.adapter.upsertMany(entities, collection);
                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }, collection.changeState);
                return didMutate ? { ...collection, changeState } : collection;
            case MergeStrategy.PreserveChanges: {
                const upsertEntities = [];
                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = {
                                ...chgState,
                                [id]: {
                                    ...chgState[id],
                                    originalValue: entity,
                                },
                            };
                            didMutate = true;
                        }
                    }
                    else {
                        upsertEntities.push(entity);
                    }
                    return chgState;
                }, collection.changeState);
                collection = this.adapter.upsertMany(upsertEntities, collection);
                return didMutate ? { ...collection, changeState } : collection;
            }
        }
    }
    // #endregion query & save helpers
    // #region track methods
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entities The entities to add. They must all have their ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackAddMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity add requires a key to be tracked`);
            }
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
                chgState[id] = { changeType: ChangeType.Added };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entity The entity to add. It must have an id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     * If not specified, implementation supplies a default strategy.
     */
    trackAddOne(entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackAddMany([entity], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param keys The primary keys of the entities to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackDeleteMany(keys, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = keys.reduce((chgState, id) => {
            const originalValue = entityMap[id];
            if (originalValue) {
                const trackedChange = chgState[id];
                if (trackedChange) {
                    if (trackedChange.changeType === ChangeType.Added) {
                        // Special case: stop tracking an added entity that you delete
                        // The caller must also detect this, remove it immediately from the collection
                        // and skip attempt to delete on the server.
                        cloneChgStateOnce();
                        delete chgState[id];
                    }
                    else if (trackedChange.changeType === ChangeType.Updated) {
                        // Special case: switch change type from Updated to Deleted.
                        cloneChgStateOnce();
                        chgState[id] = { ...chgState[id], changeType: ChangeType.Deleted };
                    }
                }
                else {
                    // Start tracking this entity
                    cloneChgStateOnce();
                    chgState[id] = { changeType: ChangeType.Deleted, originalValue };
                }
            }
            return chgState;
            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
            }
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param key The primary key of the entity to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackDeleteOne(key, collection, mergeStrategy) {
        return key == null
            ? collection
            : this.trackDeleteMany([key], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param updates The entities to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpdateMany(updates, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = updates.reduce((chgState, update) => {
            const { id, changes: entity } = update;
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity update requires a key to be tracked`);
            }
            const originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = { ...chgState };
                    }
                    chgState[id] = { changeType: ChangeType.Updated, originalValue };
                }
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param update The entity to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpdateOne(update, collection, mergeStrategy) {
        return update == null
            ? collection
            : this.trackUpdateMany([update], collection, mergeStrategy);
    }
    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entities to add or update. They must be complete entities with ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpsertMany(entities, collection, mergeStrategy) {
        if (mergeStrategy === MergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(`${collection.entityName} entity upsert requires a key to be tracked`);
            }
            const trackedChange = chgState[id];
            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
                const originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: ChangeType.Added }
                        : { changeType: ChangeType.Updated, originalValue };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entity to add or update. It must be a complete entity with its id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is MergeStrategy.IgnoreChanges.
     */
    trackUpsertOne(entity, collection, mergeStrategy) {
        return entity == null
            ? collection
            : this.trackUpsertMany([entity], collection, mergeStrategy);
    }
    // #endregion track methods
    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param collection The entity collection
     */
    undoAll(collection) {
        const ids = Object.keys(collection.changeState);
        const { remove, upsert } = ids.reduce((acc, id) => {
            const changeState = acc.chgState[id];
            switch (changeState.changeType) {
                case ChangeType.Added:
                    acc.remove.push(id);
                    break;
                case ChangeType.Deleted:
                    const removed = changeState.originalValue;
                    if (removed) {
                        acc.upsert.push(removed);
                    }
                    break;
                case ChangeType.Updated:
                    acc.upsert.push(changeState.originalValue);
                    break;
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            chgState: collection.changeState,
        });
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return { ...collection, changeState: {} };
    }
    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    undoMany(entityOrIdList, collection) {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        let didMutate = false;
        const { changeState, remove, upsert } = entityOrIdList.reduce((acc, entityOrId) => {
            let chgState = acc.changeState;
            const id = typeof entityOrId === 'object'
                ? this.selectId(entityOrId)
                : entityOrId;
            const change = chgState[id];
            if (change) {
                if (!didMutate) {
                    chgState = { ...chgState };
                    didMutate = true;
                }
                delete chgState[id]; // clear tracking of this entity
                acc.changeState = chgState;
                switch (change.changeType) {
                    case ChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case ChangeType.Deleted:
                        const removed = change.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case ChangeType.Updated:
                        acc.upsert.push(change.originalValue);
                        break;
                }
            }
            return acc;
        }, 
        // entitiesToUndo
        {
            remove: [],
            upsert: [],
            changeState: collection.changeState,
        });
        collection = this.adapter.removeMany(remove, collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? { ...collection, changeState } : collection;
    }
    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    undoOne(entityOrId, collection) {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    }
}

/**
 * Base implementation of reducer methods for an entity collection.
 */
class EntityCollectionReducerMethods {
    constructor(entityName, definition, 
    /*
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     */
    entityChangeTracker) {
        this.entityName = entityName;
        this.definition = definition;
        /**
         * Dictionary of the {EntityCollectionReducerMethods} for this entity type,
         * keyed by the {EntityOp}
         */
        this.methods = {
            [EntityOp.CANCEL_PERSIST]: this.cancelPersist.bind(this),
            [EntityOp.QUERY_ALL]: this.queryAll.bind(this),
            [EntityOp.QUERY_ALL_ERROR]: this.queryAllError.bind(this),
            [EntityOp.QUERY_ALL_SUCCESS]: this.queryAllSuccess.bind(this),
            [EntityOp.QUERY_BY_KEY]: this.queryByKey.bind(this),
            [EntityOp.QUERY_BY_KEY_ERROR]: this.queryByKeyError.bind(this),
            [EntityOp.QUERY_BY_KEY_SUCCESS]: this.queryByKeySuccess.bind(this),
            [EntityOp.QUERY_LOAD]: this.queryLoad.bind(this),
            [EntityOp.QUERY_LOAD_ERROR]: this.queryLoadError.bind(this),
            [EntityOp.QUERY_LOAD_SUCCESS]: this.queryLoadSuccess.bind(this),
            [EntityOp.QUERY_MANY]: this.queryMany.bind(this),
            [EntityOp.QUERY_MANY_ERROR]: this.queryManyError.bind(this),
            [EntityOp.QUERY_MANY_SUCCESS]: this.queryManySuccess.bind(this),
            [EntityOp.SAVE_ADD_MANY]: this.saveAddMany.bind(this),
            [EntityOp.SAVE_ADD_MANY_ERROR]: this.saveAddManyError.bind(this),
            [EntityOp.SAVE_ADD_MANY_SUCCESS]: this.saveAddManySuccess.bind(this),
            [EntityOp.SAVE_ADD_ONE]: this.saveAddOne.bind(this),
            [EntityOp.SAVE_ADD_ONE_ERROR]: this.saveAddOneError.bind(this),
            [EntityOp.SAVE_ADD_ONE_SUCCESS]: this.saveAddOneSuccess.bind(this),
            [EntityOp.SAVE_DELETE_MANY]: this.saveDeleteMany.bind(this),
            [EntityOp.SAVE_DELETE_MANY_ERROR]: this.saveDeleteManyError.bind(this),
            [EntityOp.SAVE_DELETE_MANY_SUCCESS]: this.saveDeleteManySuccess.bind(this),
            [EntityOp.SAVE_DELETE_ONE]: this.saveDeleteOne.bind(this),
            [EntityOp.SAVE_DELETE_ONE_ERROR]: this.saveDeleteOneError.bind(this),
            [EntityOp.SAVE_DELETE_ONE_SUCCESS]: this.saveDeleteOneSuccess.bind(this),
            [EntityOp.SAVE_UPDATE_MANY]: this.saveUpdateMany.bind(this),
            [EntityOp.SAVE_UPDATE_MANY_ERROR]: this.saveUpdateManyError.bind(this),
            [EntityOp.SAVE_UPDATE_MANY_SUCCESS]: this.saveUpdateManySuccess.bind(this),
            [EntityOp.SAVE_UPDATE_ONE]: this.saveUpdateOne.bind(this),
            [EntityOp.SAVE_UPDATE_ONE_ERROR]: this.saveUpdateOneError.bind(this),
            [EntityOp.SAVE_UPDATE_ONE_SUCCESS]: this.saveUpdateOneSuccess.bind(this),
            [EntityOp.SAVE_UPSERT_MANY]: this.saveUpsertMany.bind(this),
            [EntityOp.SAVE_UPSERT_MANY_ERROR]: this.saveUpsertManyError.bind(this),
            [EntityOp.SAVE_UPSERT_MANY_SUCCESS]: this.saveUpsertManySuccess.bind(this),
            [EntityOp.SAVE_UPSERT_ONE]: this.saveUpsertOne.bind(this),
            [EntityOp.SAVE_UPSERT_ONE_ERROR]: this.saveUpsertOneError.bind(this),
            [EntityOp.SAVE_UPSERT_ONE_SUCCESS]: this.saveUpsertOneSuccess.bind(this),
            // Do nothing on save errors except turn the loading flag off.
            // See the ChangeTrackerMetaReducers
            // Or the app could listen for those errors and do something
            /// cache only operations ///
            [EntityOp.ADD_ALL]: this.addAll.bind(this),
            [EntityOp.ADD_MANY]: this.addMany.bind(this),
            [EntityOp.ADD_ONE]: this.addOne.bind(this),
            [EntityOp.REMOVE_ALL]: this.removeAll.bind(this),
            [EntityOp.REMOVE_MANY]: this.removeMany.bind(this),
            [EntityOp.REMOVE_ONE]: this.removeOne.bind(this),
            [EntityOp.UPDATE_MANY]: this.updateMany.bind(this),
            [EntityOp.UPDATE_ONE]: this.updateOne.bind(this),
            [EntityOp.UPSERT_MANY]: this.upsertMany.bind(this),
            [EntityOp.UPSERT_ONE]: this.upsertOne.bind(this),
            [EntityOp.COMMIT_ALL]: this.commitAll.bind(this),
            [EntityOp.COMMIT_MANY]: this.commitMany.bind(this),
            [EntityOp.COMMIT_ONE]: this.commitOne.bind(this),
            [EntityOp.UNDO_ALL]: this.undoAll.bind(this),
            [EntityOp.UNDO_MANY]: this.undoMany.bind(this),
            [EntityOp.UNDO_ONE]: this.undoOne.bind(this),
            [EntityOp.SET_CHANGE_STATE]: this.setChangeState.bind(this),
            [EntityOp.SET_COLLECTION]: this.setCollection.bind(this),
            [EntityOp.SET_FILTER]: this.setFilter.bind(this),
            [EntityOp.SET_LOADED]: this.setLoaded.bind(this),
            [EntityOp.SET_LOADING]: this.setLoading.bind(this),
        };
        this.adapter = definition.entityAdapter;
        this.isChangeTracking = definition.noChangeTracking !== true;
        this.selectId = definition.selectId;
        this.guard = new EntityActionGuard(entityName, this.selectId);
        this.toUpdate = toUpdateFactory(this.selectId);
        this.entityChangeTracker =
            entityChangeTracker ||
                new EntityChangeTrackerBase(this.adapter, this.selectId);
    }
    /** Cancel a persistence operation */
    cancelPersist(collection) {
        return this.setLoadingFalse(collection);
    }
    // #region query operations
    queryAll(collection) {
        return this.setLoadingTrue(collection);
    }
    queryAllError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Merges query results per the MergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    queryAllSuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        return {
            ...this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy),
            loaded: true,
            loading: false,
        };
    }
    queryByKey(collection, action) {
        return this.setLoadingTrue(collection);
    }
    queryByKeyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    queryByKeySuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults([data], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    queryLoad(collection) {
        return this.setLoadingTrue(collection);
    }
    queryLoadError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    queryLoadSuccess(collection, action) {
        const data = this.extractData(action);
        return {
            ...this.adapter.setAll(data, collection),
            loading: false,
            loaded: true,
            changeState: {},
        };
    }
    queryMany(collection, action) {
        return this.setLoadingTrue(collection);
    }
    queryManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    queryManySuccess(collection, action) {
        const data = this.extractData(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        return {
            ...this.entityChangeTracker.mergeQueryResults(data, collection, mergeStrategy),
            loaded: true,
            loading: false,
        };
    }
    // #endregion query operations
    // #region save operations
    // #region saveAddMany
    /**
     * Save multiple new entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of entities.
     * If saving optimistically, the entities must have their keys.
     */
    saveAddMany(collection, action) {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
            collection = this.adapter.addMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveAddManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddMany
    // #region saveAddOne
    /**
     * Successfully saved new entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field),
     * and may even return additional new entities.
     * Therefore, upsert the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     * Note: saveAddManySuccess differs from saveAddOneSuccess when optimistic.
     * saveAddOneSuccess updates (not upserts) with the lone entity from the server.
     * There is no effect if the entity is not already in cache.
     * saveAddManySuccess will add an entity if it is not found in cache.
     */
    saveAddManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds(entities, collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddMany
    // #region saveAddOne
    /**
     * Save a new entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add entity immediately.
     * @param collection The collection to which the entity should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an entity.
     * If saving optimistically, the entity must have a key.
     */
    saveAddOne(collection, action) {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
            collection = this.adapter.addOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save a new entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entity is in the collection and
     * you may need to compensate for the error.
     */
    saveAddOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved a new entity to the server.
     * If saved pessimistically, add the entity from the server to the collection.
     * If saved optimistically, the added entity is already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveAddOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        if (this.isOptimistic(action)) {
            const update = this.toUpdate(entity);
            // Always update the cache with added entity returned from server
            collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, false /*never skip*/);
        }
        else {
            collection = this.entityChangeTracker.mergeSaveAdds([entity], collection, mergeStrategy);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddOne
    // #region saveAddMany
    // TODO MANY
    // #endregion saveAddMany
    // #region saveDeleteOne
    /**
     * Delete an entity from the server by key and remove it from the collection (if present).
     * If the entity is an unsaved new entity, remove it from the collection immediately
     * and skip the server delete request.
     * An optimistic save removes an existing entity from the collection immediately;
     * a pessimistic save removes it after the server confirms successful delete.
     * @param collection Will remove the entity with this key from the collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a primary key or an entity with a key;
     * this reducer extracts the key from the entity.
     */
    saveDeleteOne(collection, action) {
        const toDelete = this.extractData(action);
        const deleteId = typeof toDelete === 'object'
            ? this.selectId(toDelete)
            : toDelete;
        const change = collection.changeState[deleteId];
        // If entity is already tracked ...
        if (change) {
            if (change.changeType === ChangeType.Added) {
                // Remove the added entity immediately and forget about its changes (via commit).
                collection = this.adapter.removeOne(deleteId, collection);
                collection = this.entityChangeTracker.commitOne(deleteId, collection);
                // Should not waste effort trying to delete on the server because it can't be there.
                action.payload.skip = true;
            }
            else {
                // Re-track it as a delete, even if tracking is turned off for this call.
                collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
            }
        }
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection, mergeStrategy);
            collection = this.adapter.removeOne(deleteId, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to delete the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entity is not in the collection and
     * you may need to compensate for the error.
     */
    saveDeleteOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    saveDeleteOneSuccess(collection, action) {
        const deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes([deleteId], collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne(deleteId, collection);
            collection = this.entityChangeTracker.commitOne(deleteId, collection);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveDeleteOne
    // #region saveDeleteMany
    /**
     * Delete multiple entities from the server by key and remove them from the collection (if present).
     * Removes unsaved new entities from the collection immediately
     * but the id is still sent to the server for deletion even though the server will not find that entity.
     * Therefore, the server must be willing to ignore a delete request for an entity it cannot find.
     * An optimistic save removes existing entities from the collection immediately;
     * a pessimistic save removes them after the server confirms successful delete.
     * @param collection Removes entities from this collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of primary keys or entities with a key;
     * this reducer extracts the key from the entity.
     */
    saveDeleteMany(collection, action) {
        const deleteIds = this.extractData(action).map((d) => typeof d === 'object' ? this.selectId(d) : d);
        deleteIds.forEach((deleteId) => {
            const change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === ChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = this.adapter.removeOne(deleteId, collection);
                    collection = this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                }
                else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = this.entityChangeTracker.trackDeleteOne(deleteId, collection);
                }
            }
        });
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(deleteIds, collection, mergeStrategy);
            collection = this.adapter.removeMany(deleteIds, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to delete the entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entities are not in the collection and
     * you may need to compensate for the error.
     */
    saveDeleteManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    saveDeleteManySuccess(collection, action) {
        const deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(deleteIds, collection, mergeStrategy);
        }
        else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany(deleteIds, collection);
            collection = this.entityChangeTracker.commitMany(deleteIds, collection);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveDeleteMany
    // #region saveUpdateOne
    /**
     * Save an update to an existing entity.
     * If saving pessimistically, update the entity in the collection after the server confirms success.
     * If saving optimistically, update the entity immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an {Update<T>}
     */
    saveUpdateOne(collection, action) {
        const update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
            collection = this.adapter.updateOne(update, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to update the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity in the collection is in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entity in the collection was updated
     * and you may need to compensate for the error.
     */
    saveUpdateOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved the updated entity to the server.
     * If saved pessimistically, update the entity in the collection with data from the server.
     * If saved optimistically, the entity was already updated in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic, and
     * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
     * You must include an UpdateResponse even if the save was optimistic,
     * to ensure that the change tracking is properly reset.
     */
    saveUpdateOneSuccess(collection, action) {
        const update = this.guard.mustBeUpdateResponse(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates([update], collection, mergeStrategy, isOptimistic /*skip unchanged if optimistic */);
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpdateOne
    // #region saveUpdateMany
    /**
     * Save updated entities.
     * If saving pessimistically, update the entities in the collection after the server confirms success.
     * If saving optimistically, update the entities immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of {Update<T>}.
     */
    saveUpdateMany(collection, action) {
        const updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
            collection = this.adapter.updateMany(updates, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to update entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities in the collection are in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entities in the collection were updated
     * and you may need to compensate for the error.
     */
    saveUpdateManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved the updated entities to the server.
     * If saved pessimistically, the entities in the collection will be updated with data from the server.
     * If saved optimistically, the entities in the collection were already updated.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of UpdateResponse<T>.
     * You must include an UpdateResponse for every Update sent to the server,
     * even if the save was optimistic, to ensure that the change tracking is properly reset.
     */
    saveUpdateManySuccess(collection, action) {
        const updates = this.guard.mustBeUpdateResponses(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates(updates, collection, mergeStrategy, false /* never skip */);
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpdateMany
    // #region saveUpsertOne
    /**
     * Save a new or existing entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entity should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a whole entity.
     * If saving optimistically, the entity must have its key.
     */
    saveUpsertOne(collection, action) {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
            collection = this.adapter.upsertOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new or existing entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new or updated entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveUpsertOneError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveUpsertOneSuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts([entity], collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpsertOne
    // #region saveUpsertMany
    /**
     * Save multiple new or existing entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of whole entities.
     * If saving optimistically, the entities must have their keys.
     */
    saveUpsertMany(collection, action) {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
            collection = this.adapter.upsertMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }
    /**
     * Attempt to save new or existing entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    saveUpsertManyError(collection, action) {
        return this.setLoadingFalse(collection);
    }
    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    saveUpsertManySuccess(collection, action) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts(entities, collection, mergeStrategy);
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpsertMany
    // #endregion save operations
    // #region cache-only operations
    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true.
     * Merges query results, preserving unsaved changes
     */
    addAll(collection, action) {
        const entities = this.guard.mustBeEntities(action);
        return {
            ...this.adapter.setAll(entities, collection),
            loading: false,
            loaded: true,
            changeState: {},
        };
    }
    addMany(collection, action) {
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(entities, collection, mergeStrategy);
        return this.adapter.addMany(entities, collection);
    }
    addOne(collection, action) {
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(entity, collection, mergeStrategy);
        return this.adapter.addOne(entity, collection);
    }
    removeMany(collection, action) {
        // payload must be entity keys
        const keys = this.guard.mustBeKeys(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(keys, collection, mergeStrategy);
        return this.adapter.removeMany(keys, collection);
    }
    removeOne(collection, action) {
        // payload must be entity key
        const key = this.guard.mustBeKey(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(key, collection, mergeStrategy);
        return this.adapter.removeOne(key, collection);
    }
    removeAll(collection, action) {
        return {
            ...this.adapter.removeAll(collection),
            loaded: false,
            loading: false,
            changeState: {}, // Assume clearing the collection and not trying to delete all entities
        };
    }
    updateMany(collection, action) {
        // payload must be an array of `Updates<T>`, not entities
        const updates = this.guard.mustBeUpdates(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(updates, collection, mergeStrategy);
        return this.adapter.updateMany(updates, collection);
    }
    updateOne(collection, action) {
        // payload must be an `Update<T>`, not an entity
        const update = this.guard.mustBeUpdate(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(update, collection, mergeStrategy);
        return this.adapter.updateOne(update, collection);
    }
    upsertMany(collection, action) {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(entities, collection, mergeStrategy);
        return this.adapter.upsertMany(entities, collection);
    }
    upsertOne(collection, action) {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(entity, collection, mergeStrategy);
        return this.adapter.upsertOne(entity, collection);
    }
    commitAll(collection) {
        return this.entityChangeTracker.commitAll(collection);
    }
    commitMany(collection, action) {
        return this.entityChangeTracker.commitMany(this.extractData(action), collection);
    }
    commitOne(collection, action) {
        return this.entityChangeTracker.commitOne(this.extractData(action), collection);
    }
    undoAll(collection) {
        return this.entityChangeTracker.undoAll(collection);
    }
    undoMany(collection, action) {
        return this.entityChangeTracker.undoMany(this.extractData(action), collection);
    }
    undoOne(collection, action) {
        return this.entityChangeTracker.undoOne(this.extractData(action), collection);
    }
    /** Dangerous: Completely replace the collection's ChangeState. Use rarely and wisely. */
    setChangeState(collection, action) {
        const changeState = this.extractData(action);
        return collection.changeState === changeState
            ? collection
            : { ...collection, changeState };
    }
    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     */
    setCollection(collection, action) {
        const newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    }
    setFilter(collection, action) {
        const filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : { ...collection, filter };
    }
    setLoaded(collection, action) {
        const loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : { ...collection, loaded };
    }
    setLoading(collection, action) {
        return this.setLoadingFlag(collection, this.extractData(action));
    }
    setLoadingFalse(collection) {
        return this.setLoadingFlag(collection, false);
    }
    setLoadingTrue(collection) {
        return this.setLoadingFlag(collection, true);
    }
    /** Set the collection's loading flag */
    setLoadingFlag(collection, loading) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : { ...collection, loading };
    }
    // #endregion Cache-only operations
    // #region helpers
    /** Safely extract data from the EntityAction payload */
    extractData(action) {
        return (action.payload && action.payload.data);
    }
    /** Safely extract MergeStrategy from EntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    extractMergeStrategy(action) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : MergeStrategy.IgnoreChanges;
    }
    isOptimistic(action) {
        return action.payload && action.payload.isOptimistic === true;
    }
}
/**
 * Creates {EntityCollectionReducerMethods} for a given entity type.
 */
class EntityCollectionReducerMethodsFactory {
    constructor(entityDefinitionService) {
        this.entityDefinitionService = entityDefinitionService;
    }
    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    create(entityName) {
        const definition = this.entityDefinitionService.getDefinition(entityName);
        const methodsClass = new EntityCollectionReducerMethods(entityName, definition);
        return methodsClass.methods;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerMethodsFactory, deps: [{ token: EntityDefinitionService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerMethodsFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerMethodsFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityDefinitionService }] });

/** Create a default reducer for a specific entity collection */
class EntityCollectionReducerFactory {
    constructor(methodsFactory) {
        this.methodsFactory = methodsFactory;
    }
    /** Create a default reducer for a collection of entities of T */
    create(entityName) {
        const methods = this.methodsFactory.create(entityName);
        /** Perform Actions against a particular entity collection in the EntityCache */
        return function entityCollectionReducer(collection, action) {
            const reducerMethod = methods[action.payload.entityOp];
            return reducerMethod ? reducerMethod(collection, action) : collection;
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory, deps: [{ token: EntityCollectionReducerMethodsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionReducerMethodsFactory }] });

/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
class EntityCollectionReducerRegistry {
    constructor(entityCollectionReducerFactory, entityCollectionMetaReducers) {
        this.entityCollectionReducerFactory = entityCollectionReducerFactory;
        this.entityCollectionReducers = {};
        // eslint-disable-next-line prefer-spread
        this.entityCollectionMetaReducer = compose.apply(null, entityCollectionMetaReducers || []);
    }
    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @param entityName Name of the entity type for this reducer
     */
    getOrCreateReducer(entityName) {
        let reducer = this.entityCollectionReducers[entityName];
        if (!reducer) {
            reducer = this.entityCollectionReducerFactory.create(entityName);
            reducer = this.registerReducer(entityName, reducer);
            this.entityCollectionReducers[entityName] = reducer;
        }
        return reducer;
    }
    /**
     * Register an EntityCollectionReducer for an entity type
     * @param entityName - the name of the entity type
     * @param reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     */
    registerReducer(entityName, reducer) {
        reducer = this.entityCollectionMetaReducer(reducer);
        return (this.entityCollectionReducers[entityName.trim()] = reducer);
    }
    /**
     * Register a batch of EntityCollectionReducers.
     * @param reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     */
    registerReducers(reducers) {
        const keys = reducers ? Object.keys(reducers) : [];
        keys.forEach((key) => this.registerReducer(key, reducers[key]));
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, deps: [{ token: EntityCollectionReducerFactory }, { token: ENTITY_COLLECTION_META_REDUCERS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionReducerFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_COLLECTION_META_REDUCERS]
                }] }] });

/**
 * Creates the EntityCacheReducer via its create() method
 */
class EntityCacheReducerFactory {
    constructor(entityCollectionCreator, entityCollectionReducerRegistry, logger) {
        this.entityCollectionCreator = entityCollectionCreator;
        this.entityCollectionReducerRegistry = entityCollectionReducerRegistry;
        this.logger = logger;
    }
    /**
     * Create the @ngrx/data entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    create() {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);
        function entityCacheReducer(entityCache = {}, action) {
            // EntityCache actions
            switch (action.type) {
                case EntityCacheAction.CLEAR_COLLECTIONS: {
                    return this.clearCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.LOAD_COLLECTIONS: {
                    return this.loadCollectionsReducer(entityCache, action);
                }
                case EntityCacheAction.MERGE_QUERY_SET: {
                    return this.mergeQuerySetReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES: {
                    return this.saveEntitiesReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_CANCEL: {
                    return this.saveEntitiesCancelReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_ERROR: {
                    return this.saveEntitiesErrorReducer(entityCache, action);
                }
                case EntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                    return this.saveEntitiesSuccessReducer(entityCache, action);
                }
                case EntityCacheAction.SET_ENTITY_CACHE: {
                    // Completely replace the EntityCache. Be careful!
                    return action.payload.cache;
                }
            }
            // Apply entity collection reducer if this is a valid EntityAction for a collection
            const payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, action);
            }
            // Not a valid EntityAction
            return entityCache;
        }
    }
    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a ClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    clearCollectionsReducer(entityCache, action) {
        // eslint-disable-next-line prefer-const
        let { collections, tag } = action.payload;
        const entityOp = EntityOp.REMOVE_ALL;
        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }
        entityCache = collections.reduce((newCache, entityName) => {
            const payload = { entityName, entityOp };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a LoadCollections action whose payload is the QuerySet of entity collections to load
     */
    loadCollectionsReducer(entityCache, action) {
        const { collections, tag } = action.payload;
        const entityOp = EntityOp.ADD_ALL;
        const entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: collections[entityName],
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a MergeQuerySet action with the query set and a MergeStrategy
     */
    mergeQuerySetReducer(entityCache, action) {
        // eslint-disable-next-line prefer-const
        let { mergeStrategy, querySet, tag } = action.payload;
        mergeStrategy =
            mergeStrategy === null ? MergeStrategy.PreserveChanges : mergeStrategy;
        const entityOp = EntityOp.QUERY_MANY_SUCCESS;
        const entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: querySet[entityName],
                mergeStrategy,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }
    // #region saveEntities reducers
    saveEntitiesReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
        try {
            changeSet.changes.forEach((item) => {
                const entityName = item.entityName;
                const payload = {
                    entityName,
                    entityOp: getEntityOp(item),
                    data: item.entities,
                    correlationId,
                    isOptimistic,
                    mergeStrategy,
                    tag,
                };
                const act = {
                    type: `[${entityName}] ${action.type}`,
                    payload,
                };
                entityCache = this.applyCollectionReducer(entityCache, act);
                if (act.payload.error) {
                    throw act.payload.error;
                }
            });
        }
        catch (error) {
            action.payload.error = error;
        }
        return entityCache;
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY;
            }
        }
    }
    saveEntitiesCancelReducer(entityCache, action) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(entityCache, action.payload.entityNames || []);
    }
    saveEntitiesErrorReducer(entityCache, action) {
        const originalAction = action.payload.originalAction;
        const originalChangeSet = originalAction.payload.changeSet;
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        const entityNames = originalChangeSet.changes.map((item) => item.entityName);
        return this.clearLoadingFlags(entityCache, entityNames);
    }
    saveEntitiesSuccessReducer(entityCache, action) {
        const { changeSet, correlationId, isOptimistic, mergeStrategy, tag } = action.payload;
        changeSet.changes.forEach((item) => {
            const entityName = item.entityName;
            const payload = {
                entityName,
                entityOp: getEntityOp(item),
                data: item.entities,
                correlationId,
                isOptimistic,
                mergeStrategy,
                tag,
            };
            const act = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            entityCache = this.applyCollectionReducer(entityCache, act);
        });
        return entityCache;
        function getEntityOp(item) {
            switch (item.op) {
                case ChangeSetOperation.Add:
                    return EntityOp.SAVE_ADD_MANY_SUCCESS;
                case ChangeSetOperation.Delete:
                    return EntityOp.SAVE_DELETE_MANY_SUCCESS;
                case ChangeSetOperation.Update:
                    return EntityOp.SAVE_UPDATE_MANY_SUCCESS;
                case ChangeSetOperation.Upsert:
                    return EntityOp.SAVE_UPSERT_MANY_SUCCESS;
            }
        }
    }
    // #endregion saveEntities reducers
    // #region helpers
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    applyCollectionReducer(cache = {}, action) {
        const entityName = action.payload.entityName;
        const collection = cache[entityName];
        const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(entityName);
        let newCollection;
        try {
            newCollection = collection
                ? reducer(collection, action)
                : reducer(this.entityCollectionCreator.create(entityName), action);
        }
        catch (error) {
            this.logger.error(error);
            action.payload.error = error;
        }
        return action.payload.error || collection === newCollection
            ? cache
            : { ...cache, [entityName]: newCollection };
    }
    /** Ensure loading is false for every collection in entityNames */
    clearLoadingFlags(entityCache, entityNames) {
        let isMutated = false;
        entityNames.forEach((entityName) => {
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = { ...entityCache };
                    isMutated = true;
                }
                entityCache[entityName] = { ...collection, loading: false };
            }
        });
        return entityCache;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory, deps: [{ token: EntityCollectionCreator }, { token: EntityCollectionReducerRegistry }, { token: Logger }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCacheReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: EntityCollectionCreator }, { type: EntityCollectionReducerRegistry }, { type: Logger }] });

class DefaultLogger {
    error(message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    }
    log(message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    }
    warn(message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger, decorators: [{
            type: Injectable
        }] });

const uncountable = [
    // 'sheep',
    // 'fish',
    // 'deer',
    // 'moose',
    // 'rice',
    // 'species',
    'equipment',
    'information',
    'money',
    'series',
];
class DefaultPluralizer {
    constructor(pluralNames) {
        this.pluralNames = {};
        // merge each plural names object
        if (pluralNames) {
            pluralNames.forEach((pn) => this.registerPluralNames(pn));
        }
    }
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     */
    pluralize(name) {
        const plural = this.pluralNames[name];
        if (plural) {
            return plural;
        }
        // singular and plural are the same
        if (uncountable.indexOf(name.toLowerCase()) >= 0) {
            return name;
            // vowel + y
        }
        else if (/[aeiou]y$/.test(name)) {
            return name + 's';
            // consonant + y
        }
        else if (name.endsWith('y')) {
            return name.substring(0, name.length - 1) + 'ies';
            // endings typically pluralized with 'es'
        }
        else if (/[s|ss|sh|ch|x|z]$/.test(name)) {
            return name + 'es';
        }
        else {
            return name + 's';
        }
    }
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param pluralNames {EntityPluralNames} plural names for entity types
     */
    registerPluralNames(pluralNames) {
        this.pluralNames = { ...this.pluralNames, ...(pluralNames || {}) };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer, deps: [{ token: PLURAL_NAMES_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [PLURAL_NAMES_TOKEN]
                }] }] });

/**
  Client-side id-generators

  These GUID utility functions are not used by @ngrx/data itself at this time.
  They are included as candidates for generating persistable correlation ids if that becomes desirable.
  They are also safe for generating unique entity ids on the client.

  Note they produce 32-character hexadecimal UUID strings,
  not the 128-bit representation found in server-side languages and databases.

  These utilities are experimental and may be withdrawn or replaced in future.
*/
/**
 * Creates a Universally Unique Identifier (AKA GUID)
 */
function getUuid() {
    // The original implementation is based on this SO answer:
    // http://stackoverflow.com/a/2117523/200253
    return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0, 
        // eslint-disable-next-line no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/** Alias for getUuid(). Compare with getGuidComb(). */
function getGuid() {
    return getUuid();
}
/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part
 */
function getGuidComb(seed) {
    // Each new Guid is greater than next if more than 1ms passes
    // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
    // Based on breeze.core.getUuid which is based on this StackOverflow answer
    // http://stackoverflow.com/a/2117523/200253
    //
    // Convert time value to hex: n.toString(16)
    // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
    // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
    //
    // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
    const timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
    return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, function (c) {
        /* eslint-disable no-bitwise */
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }) + timePart);
}
// Sort comparison value that's good enough
function guidComparer(l, r) {
    const lLow = l.slice(-12);
    const rLow = r.slice(-12);
    return lLow !== rLow
        ? lLow < rLow
            ? -1
            : +(lLow !== rLow)
        : l < r
            ? -1
            : +(l !== r);
}

const BASE_ENTITY_DATA_PROVIDERS = [
    CorrelationIdGenerator,
    EntityDispatcherDefaultOptions,
    EntityActionFactory,
    EntityCacheDispatcher,
    EntityCacheReducerFactory,
    entityCacheSelectorProvider,
    EntityCollectionCreator,
    EntityCollectionReducerFactory,
    EntityCollectionReducerMethodsFactory,
    EntityCollectionReducerRegistry,
    EntityCollectionServiceElementsFactory,
    EntityCollectionServiceFactory,
    EntityDefinitionService,
    EntityDispatcherFactory,
    EntitySelectorsFactory,
    EntitySelectors$Factory,
    EntityServicesElements,
    { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ENTITY_CACHE_NAME },
    { provide: EntityServices, useClass: EntityServicesBase },
    { provide: Logger, useClass: DefaultLogger },
    {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useValue: () => initializeBaseEntityData(),
    },
];
function initializeBaseEntityData() {
    const reducerManager = inject(ReducerManager);
    const entityCacheReducerFactory = inject(EntityCacheReducerFactory);
    const entityCacheName = inject(ENTITY_CACHE_NAME_TOKEN, {
        optional: true,
    });
    const initialStateOrFn = inject(INITIAL_ENTITY_CACHE_STATE, {
        optional: true,
    });
    const metaReducersOrTokens = inject(ENTITY_CACHE_META_REDUCERS, {
        optional: true,
    });
    // Add the @ngrx/data feature to the Store's features
    const key = entityCacheName || ENTITY_CACHE_NAME;
    const metaReducers = (metaReducersOrTokens || []).map((mr) => {
        return mr instanceof InjectionToken ? inject(mr) : mr;
    });
    const initialState = typeof initialStateOrFn === 'function'
        ? initialStateOrFn()
        : initialStateOrFn;
    const entityCacheFeature = {
        key,
        reducers: entityCacheReducerFactory.create(),
        reducerFactory: combineReducers,
        initialState: initialState || {},
        metaReducers: metaReducers,
    };
    reducerManager.addFeature(entityCacheFeature);
}
const ENTITY_DATA_EFFECTS_PROVIDERS = [
    DefaultDataServiceFactory,
    EntityCacheDataService,
    EntityDataService,
    EntityCacheEffects,
    EntityEffects,
    { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
    {
        provide: PersistenceResultHandler,
        useClass: DefaultPersistenceResultHandler,
    },
    { provide: Pluralizer, useClass: DefaultPluralizer },
    {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useValue: () => initializeEntityDataEffects(),
    },
];
function initializeEntityDataEffects() {
    const effectsSources = inject(EffectSources);
    const entityCacheEffects = inject(EntityCacheEffects);
    const entityEffects = inject(EntityEffects);
    effectsSources.addEffects(entityCacheEffects);
    effectsSources.addEffects(entityEffects);
}
function provideEntityDataConfig(config) {
    return [
        {
            provide: ENTITY_CACHE_META_REDUCERS,
            useValue: config.entityCacheMetaReducers
                ? config.entityCacheMetaReducers
                : [],
        },
        {
            provide: ENTITY_COLLECTION_META_REDUCERS,
            useValue: config.entityCollectionMetaReducers
                ? config.entityCollectionMetaReducers
                : [],
        },
        {
            provide: PLURAL_NAMES_TOKEN,
            multi: true,
            useValue: config.pluralNames ? config.pluralNames : {},
        },
        {
            provide: ENTITY_METADATA_TOKEN,
            multi: true,
            useValue: config.entityMetadata ? config.entityMetadata : [],
        },
    ];
}
/**
 * Sets up base entity data providers with entity config.
 * This function should to be used at the root level.
 *
 * @usageNotes
 *
 * ### Providing entity data with effects
 *
 * When used with `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModule.forRoot`
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { provideEffects } from '@ngrx/effects';
 * import {
 *   EntityMetadataMap,
 *   provideEntityData,
 *   withEffects,
 * } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Hero: {},
 *   Villain: {},
 * };
 * const pluralNames = { Hero: 'Heroes' };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEffects(),
 *     provideEntityData({ entityMetadata, pluralNames }, withEffects()),
 *   ],
 * });
 * ```
 *
 * ### Providing entity data without effects
 *
 * When used without `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModuleWithoutEffects.forRoot`.
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { EntityMetadataMap, provideEntityData } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Musician: {},
 *   Song: {},
 * };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEntityData({ entityMetadata }),
 *   ],
 * });
 * ```
 *
 */
function provideEntityData(config, ...features) {
    return makeEnvironmentProviders([
        BASE_ENTITY_DATA_PROVIDERS,
        provideEntityDataConfig(config),
        ...features.map((feature) => feature.ɵproviders),
    ]);
}
var EntityDataFeatureKind;
(function (EntityDataFeatureKind) {
    EntityDataFeatureKind[EntityDataFeatureKind["WithEffects"] = 0] = "WithEffects";
})(EntityDataFeatureKind || (EntityDataFeatureKind = {}));
/**
 * Registers entity data effects and provides HTTP data services.
 *
 * @see `provideEntityData`
 */
function withEffects() {
    return {
        ɵkind: EntityDataFeatureKind.WithEffects,
        ɵproviders: [ENTITY_DATA_EFFECTS_PROVIDERS],
    };
}

/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
class EntityDataModuleWithoutEffects {
    static forRoot(config) {
        return {
            ngModule: EntityDataModuleWithoutEffects,
            providers: [provideEntityDataConfig(config)],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, providers: [BASE_ENTITY_DATA_PROVIDERS] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModuleWithoutEffects, decorators: [{
            type: NgModule,
            args: [{
                    providers: [BASE_ENTITY_DATA_PROVIDERS],
                }]
        }] });

/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
class EntityDataModule {
    static forRoot(config) {
        return {
            ngModule: EntityDataModule,
            providers: [provideEntityDataConfig(config)],
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModule, imports: [EntityDataModuleWithoutEffects] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModule, providers: [ENTITY_DATA_EFFECTS_PROVIDERS], imports: [EntityDataModuleWithoutEffects] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityDataModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [EntityDataModuleWithoutEffects],
                    providers: [ENTITY_DATA_EFFECTS_PROVIDERS],
                }]
        }] });

// actions

/**
 * DO NOT EDIT
 *
 * This file is automatically generated at build
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ChangeSetItemFactory, ChangeSetOperation, ChangeType, ClearCollections, CorrelationIdGenerator, DataServiceError, DefaultDataService, DefaultDataServiceConfig, DefaultDataServiceFactory, DefaultHttpUrlGenerator, DefaultLogger, DefaultPersistenceResultHandler, DefaultPluralizer, ENTITY_CACHE_META_REDUCERS, ENTITY_CACHE_NAME, ENTITY_CACHE_NAME_TOKEN, ENTITY_CACHE_SELECTOR_TOKEN, ENTITY_COLLECTION_META_REDUCERS, ENTITY_METADATA_TOKEN, EntityActionFactory, EntityActionGuard, EntityCacheAction, EntityCacheDataService, EntityCacheDispatcher, EntityCacheEffects, EntityCacheReducerFactory, EntityChangeTrackerBase, EntityCollectionCreator, EntityCollectionReducerFactory, EntityCollectionReducerMethods, EntityCollectionReducerMethodsFactory, EntityCollectionReducerRegistry, EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, EntityCollectionServiceFactory, EntityDataModule, EntityDataModuleWithoutEffects, EntityDataService, EntityDefinitionService, EntityDispatcherBase, EntityDispatcherDefaultOptions, EntityDispatcherFactory, EntityEffects, EntityHttpResourceUrls, EntityOp, EntitySelectors$Factory, EntitySelectorsFactory, EntityServices, EntityServicesBase, EntityServicesElements, HttpUrlGenerator, INITIAL_ENTITY_CACHE_STATE, LoadCollections, Logger, MergeQuerySet, MergeStrategy, OP_ERROR, OP_SUCCESS, PLURAL_NAMES_TOKEN, PersistanceCanceled, PersistenceResultHandler, Pluralizer, PropsFilterFnFactory, SaveEntities, SaveEntitiesCancel, SaveEntitiesCanceled, SaveEntitiesError, SaveEntitiesSuccess, SetEntityCache, changeSetItemFactory, createEmptyEntityCollection, createEntityCacheSelector, createEntityDefinition, defaultSelectId, entityCacheSelectorProvider, excludeEmptyChangeSetItems, flattenArgs, getGuid, getGuidComb, guidComparer, makeErrorOp, makeSuccessOp, normalizeRoot, ofEntityOp, ofEntityType, persistOps, provideEntityData, toUpdateFactory, withEffects };
//# sourceMappingURL=ngrx-data.mjs.map
