import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
export class EntityDispatcherDefaultOptions {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRpc3BhdGNoZXItZGVmYXVsdC1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kaXNwYXRjaGVycy9lbnRpdHktZGlzcGF0Y2hlci1kZWZhdWx0LW9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFDM0M7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyw4QkFBOEI7SUFEM0M7UUFFRSx1RkFBdUY7UUFDdkYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIseUZBQXlGO1FBQ3pGLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUN4Qix5RkFBeUY7UUFDekYscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLHdGQUF3RjtRQUN4RixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsaUhBQWlIO1FBQ2pILDJCQUFzQixHQUFHLEtBQUssQ0FBQztLQUNoQztpSUFYWSw4QkFBOEI7cUlBQTlCLDhCQUE4Qjs7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciBFbnRpdHlEaXNwYXRjaGVyIGJlaGF2aW9yXG4gKiBzdWNoIGFzIHdoZXRoZXIgYGFkZCgpYCBpcyBvcHRpbWlzdGljIG9yIHBlc3NpbWlzdGljIGJ5IGRlZmF1bHQuXG4gKiBBbiBvcHRpbWlzdGljIHNhdmUgbW9kaWZpZXMgdGhlIGNvbGxlY3Rpb24gaW1tZWRpYXRlbHkgYW5kIGJlZm9yZSBzYXZpbmcgdG8gdGhlIHNlcnZlci5cbiAqIEEgcGVzc2ltaXN0aWMgc2F2ZSBtb2RpZmllcyB0aGUgY29sbGVjdGlvbiBhZnRlciB0aGUgc2VydmVyIGNvbmZpcm1zIHRoZSBzYXZlIHdhcyBzdWNjZXNzZnVsLlxuICogVGhpcyBjbGFzcyBpbml0aWFsaXplcyB0aGUgZGVmYXVsdHMgdG8gdGhlIHNhZmVzdCB2YWx1ZXMuXG4gKiBQcm92aWRlIGFuIGFsdGVybmF0aXZlIHRvIGNoYW5nZSB0aGUgZGVmYXVsdHMgZm9yIGFsbCBlbnRpdHkgY29sbGVjdGlvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlEaXNwYXRjaGVyRGVmYXVsdE9wdGlvbnMge1xuICAvKiogVHJ1ZSBpZiBhZGRlZCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY0FkZCA9IGZhbHNlO1xuICAvKiogVHJ1ZSBpZiBkZWxldGVkIGVudGl0aWVzIGFyZSBzYXZlZCBvcHRpbWlzdGljYWxseTsgZmFsc2UgaWYgc2F2ZWQgcGVzc2ltaXN0aWNhbGx5LiAqL1xuICBvcHRpbWlzdGljRGVsZXRlID0gdHJ1ZTtcbiAgLyoqIFRydWUgaWYgdXBkYXRlZCBlbnRpdGllcyBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY1VwZGF0ZSA9IGZhbHNlO1xuICAvKiogVHJ1ZSBpZiB1cHNlcnQgZW50aXRpZXMgYXJlIHNhdmVkIG9wdGltaXN0aWNhbGx5OyBmYWxzZSBpZiBzYXZlZCBwZXNzaW1pc3RpY2FsbHkuICovXG4gIG9wdGltaXN0aWNVcHNlcnQgPSBmYWxzZTtcbiAgLyoqIFRydWUgaWYgZW50aXRpZXMgaW4gYSBjYWNoZSBzYXZlRW50aXRpZXMgcmVxdWVzdCBhcmUgc2F2ZWQgb3B0aW1pc3RpY2FsbHk7IGZhbHNlIGlmIHNhdmVkIHBlc3NpbWlzdGljYWxseS4gKi9cbiAgb3B0aW1pc3RpY1NhdmVFbnRpdGllcyA9IGZhbHNlO1xufVxuIl19