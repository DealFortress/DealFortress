import { Inject, Injectable, Optional } from '@angular/core';
import { compose } from '@ngrx/store';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-reducer";
/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
export class EntityCollectionReducerRegistry {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, deps: [{ token: i1.EntityCollectionReducerFactory }, { token: ENTITY_COLLECTION_META_REDUCERS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerRegistry, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionReducerFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ENTITY_COLLECTION_META_REDUCERS]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci1yZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGFBQWEsQ0FBQztBQUluRCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQVc5RDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sK0JBQStCO0lBTzFDLFlBQ1UsOEJBQThELEVBR3RFLDRCQUE0RTtRQUhwRSxtQ0FBOEIsR0FBOUIsOEJBQThCLENBQWdDO1FBUDlELDZCQUF3QixHQUE2QixFQUFFLENBQUM7UUFZaEUseUNBQXlDO1FBQ3pDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUM5QyxJQUFJLEVBQ0osNEJBQTRCLElBQUksRUFBRSxDQUM1QixDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtCQUFrQixDQUFJLFVBQWtCO1FBQ3RDLElBQUksT0FBTyxHQUNULElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQUksVUFBVSxDQUFDLENBQUM7WUFDcEUsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUksVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7U0FDckQ7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxlQUFlLENBQ2IsVUFBa0IsRUFDbEIsT0FBbUM7UUFFbkMsT0FBTyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFjLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxnQkFBZ0IsQ0FBQyxRQUFrQztRQUNqRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7aUlBbEVVLCtCQUErQixnRUFVaEMsK0JBQStCO3FJQVY5QiwrQkFBK0I7OzJGQUEvQiwrQkFBK0I7a0JBRDNDLFVBQVU7OzBCQVVOLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tcG9zZSwgTWV0YVJlZHVjZXIgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbic7XG5pbXBvcnQgeyBFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgRW50aXR5Q29sbGVjdGlvblJlZHVjZXIsXG4gIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeSxcbn0gZnJvbSAnLi9lbnRpdHktY29sbGVjdGlvbi1yZWR1Y2VyJztcblxuLyoqIEEgaGFzaCBvZiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzIHtcbiAgW2VudGl0eTogc3RyaW5nXTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8YW55Pjtcbn1cblxuLyoqXG4gKiBSZWdpc3RyeSBvZiBlbnRpdHkgdHlwZXMgYW5kIHRoZWlyIHByZXZpb3VzbHktY29uc3RydWN0ZWQgcmVkdWNlcnMuXG4gKiBDYW4gY3JlYXRlIGEgbmV3IENvbGxlY3Rpb25SZWR1Y2VyLCB3aGljaCBpdCByZWdpc3RlcnMgZm9yIHN1YnNlcXVlbnQgdXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJSZWdpc3RyeSB7XG4gIHByb3RlY3RlZCBlbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnM6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VycyA9IHt9O1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcjogTWV0YVJlZHVjZXI8XG4gICAgRW50aXR5Q29sbGVjdGlvbixcbiAgICBFbnRpdHlBY3Rpb25cbiAgPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChFTlRJVFlfQ09MTEVDVElPTl9NRVRBX1JFRFVDRVJTKVxuICAgIGVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlcnM/OiBNZXRhUmVkdWNlcjxFbnRpdHlDb2xsZWN0aW9uLCBFbnRpdHlBY3Rpb24+W11cbiAgKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1zcHJlYWRcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25NZXRhUmVkdWNlciA9IGNvbXBvc2UuYXBwbHkoXG4gICAgICBudWxsLFxuICAgICAgZW50aXR5Q29sbGVjdGlvbk1ldGFSZWR1Y2VycyB8fCBbXVxuICAgICkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcmVnaXN0ZXJlZCBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcjxUPiBmb3IgdGhpcyBlbnRpdHkgdHlwZSBvciBjcmVhdGUgb25lIGFuZCByZWdpc3RlciBpdC5cbiAgICogQHBhcmFtIGVudGl0eU5hbWUgTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUgZm9yIHRoaXMgcmVkdWNlclxuICAgKi9cbiAgZ2V0T3JDcmVhdGVSZWR1Y2VyPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHtcbiAgICBsZXQgcmVkdWNlcjogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4gPVxuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbZW50aXR5TmFtZV07XG5cbiAgICBpZiAoIXJlZHVjZXIpIHtcbiAgICAgIHJlZHVjZXIgPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyRmFjdG9yeS5jcmVhdGU8VD4oZW50aXR5TmFtZSk7XG4gICAgICByZWR1Y2VyID0gdGhpcy5yZWdpc3RlclJlZHVjZXI8VD4oZW50aXR5TmFtZSwgcmVkdWNlcik7XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25SZWR1Y2Vyc1tlbnRpdHlOYW1lXSA9IHJlZHVjZXI7XG4gICAgfVxuICAgIHJldHVybiByZWR1Y2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyIGZvciBhbiBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gZW50aXR5TmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbnRpdHkgdHlwZVxuICAgKiBAcGFyYW0gcmVkdWNlciAtIHJlZHVjZXIgZm9yIHRoYXQgZW50aXR5IHR5cGVcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJSZWR1Y2VyKCdIZXJvJywgbXlIZXJvUmVkdWNlcik7XG4gICAqICAgcmVnaXN0ZXJSZWR1Y2VyKCdWaWxsYWluJywgbXlWaWxsYWluUmVkdWNlcik7XG4gICAqL1xuICByZWdpc3RlclJlZHVjZXI8VD4oXG4gICAgZW50aXR5TmFtZTogc3RyaW5nLFxuICAgIHJlZHVjZXI6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+XG4gICk6IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQ+IHtcbiAgICByZWR1Y2VyID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9uTWV0YVJlZHVjZXIocmVkdWNlciBhcyBhbnkpO1xuICAgIHJldHVybiAodGhpcy5lbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnNbZW50aXR5TmFtZS50cmltKCldID0gcmVkdWNlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBiYXRjaCBvZiBFbnRpdHlDb2xsZWN0aW9uUmVkdWNlcnMuXG4gICAqIEBwYXJhbSByZWR1Y2VycyAtIHJlZHVjZXJzIHRvIG1lcmdlIGludG8gZXhpc3RpbmcgcmVkdWNlcnNcbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqICAgcmVnaXN0ZXJSZWR1Y2Vycyh7XG4gICAqICAgICBIZXJvOiBteUhlcm9SZWR1Y2VyLFxuICAgKiAgICAgVmlsbGFpbjogbXlWaWxsYWluUmVkdWNlclxuICAgKiAgIH0pO1xuICAgKi9cbiAgcmVnaXN0ZXJSZWR1Y2VycyhyZWR1Y2VyczogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJzKSB7XG4gICAgY29uc3Qga2V5cyA9IHJlZHVjZXJzID8gT2JqZWN0LmtleXMocmVkdWNlcnMpIDogW107XG4gICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHRoaXMucmVnaXN0ZXJSZWR1Y2VyKGtleSwgcmVkdWNlcnNba2V5XSkpO1xuICB9XG59XG4iXX0=