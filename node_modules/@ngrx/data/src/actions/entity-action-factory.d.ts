import { EntityOp } from './entity-op';
import { EntityAction, EntityActionOptions, EntityActionPayload } from './entity-action';
import * as i0 from "@angular/core";
export declare class EntityActionFactory {
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param entityName Name of the entity type
     * @param entityOp Operation to perform (EntityOp)
     * @param [data] data for the operation
     * @param [options] additional options
     */
    create<P = any>(entityName: string, entityOp: EntityOp, data?: P, options?: EntityActionOptions): EntityAction<P>;
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    create<P = any>(payload: EntityActionPayload<P>): EntityAction<P>;
    /**
     * Create an EntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the EntityAction and its options
     */
    protected createCore<P = any>(payload: EntityActionPayload<P>): {
        type: string;
        payload: EntityActionPayload<P>;
    };
    /**
     * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New EntityAction properties that replace the source action properties
     */
    createFromAction<P = any>(from: EntityAction, newProperties: Partial<EntityActionPayload<P>>): EntityAction<P>;
    formatActionType(op: string, tag: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityActionFactory, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityActionFactory>;
}
