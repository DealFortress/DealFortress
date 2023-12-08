import * as i0 from "@angular/core";
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
export declare class EntityDispatcherDefaultOptions {
    /** True if added entities are saved optimistically; false if saved pessimistically. */
    optimisticAdd: boolean;
    /** True if deleted entities are saved optimistically; false if saved pessimistically. */
    optimisticDelete: boolean;
    /** True if updated entities are saved optimistically; false if saved pessimistically. */
    optimisticUpdate: boolean;
    /** True if upsert entities are saved optimistically; false if saved pessimistically. */
    optimisticUpsert: boolean;
    /** True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically. */
    optimisticSaveEntities: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDispatcherDefaultOptions, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EntityDispatcherDefaultOptions>;
}
