import { OperatorFunction } from 'rxjs';
import { EntityAction } from './entity-action';
import { EntityOp } from './entity-op';
/**
 * Select actions concerning one of the allowed Entity operations
 * @param allowedEntityOps Entity operations (e.g, EntityOp.QUERY_ALL) whose actions should be selected
 * Example:
 * ```
 *  this.actions.pipe(ofEntityOp(EntityOp.QUERY_ALL, EntityOp.QUERY_MANY), ...)
 *  this.actions.pipe(ofEntityOp(...queryOps), ...)
 *  this.actions.pipe(ofEntityOp(queryOps), ...)
 *  this.actions.pipe(ofEntityOp(), ...) // any action with a defined `entityOp` property
 * ```
 */
export declare function ofEntityOp<T extends EntityAction>(allowedOps: string[] | EntityOp[]): OperatorFunction<EntityAction, T>;
export declare function ofEntityOp<T extends EntityAction>(...allowedOps: (string | EntityOp)[]): OperatorFunction<EntityAction, T>;
/**
 * Select actions concerning one of the allowed Entity types
 * @param allowedEntityNames Entity-type names (e.g, 'Hero') whose actions should be selected
 * Example:
 * ```
 *  this.actions.pipe(ofEntityType(), ...) // ayn EntityAction with a defined entity type property
 *  this.actions.pipe(ofEntityType('Hero'), ...) // EntityActions for the Hero entity
 *  this.actions.pipe(ofEntityType('Hero', 'Villain', 'Sidekick'), ...)
 *  this.actions.pipe(ofEntityType(...theChosen), ...)
 *  this.actions.pipe(ofEntityType(theChosen), ...)
 * ```
 */
export declare function ofEntityType<T extends EntityAction>(allowedEntityNames?: string[]): OperatorFunction<EntityAction, T>;
export declare function ofEntityType<T extends EntityAction>(...allowedEntityNames: string[]): OperatorFunction<EntityAction, T>;
