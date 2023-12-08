import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./entity-collection-reducer-methods";
/** Create a default reducer for a specific entity collection */
export class EntityCollectionReducerFactory {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory, deps: [{ token: i1.EntityCollectionReducerMethodsFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionReducerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityCollectionReducerMethodsFactory }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFXM0MsZ0VBQWdFO0FBRWhFLE1BQU0sT0FBTyw4QkFBOEI7SUFDekMsWUFBb0IsY0FBcUQ7UUFBckQsbUJBQWMsR0FBZCxjQUFjLENBQXVDO0lBQUcsQ0FBQztJQUU3RSxpRUFBaUU7SUFDakUsTUFBTSxDQUFVLFVBQWtCO1FBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFJLFVBQVUsQ0FBQyxDQUFDO1FBRTFELGdGQUFnRjtRQUNoRixPQUFPLFNBQVMsdUJBQXVCLENBQ3JDLFVBQStCLEVBQy9CLE1BQW9CO1lBRXBCLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDeEUsQ0FBQyxDQUFDO0lBQ0osQ0FBQztpSUFmVSw4QkFBOEI7cUlBQTlCLDhCQUE4Qjs7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW50aXR5QWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyTWV0aG9kc0ZhY3RvcnkgfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uLXJlZHVjZXItbWV0aG9kcyc7XG5cbmV4cG9ydCB0eXBlIEVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyPFQgPSBhbnk+ID0gKFxuICBjb2xsZWN0aW9uOiBFbnRpdHlDb2xsZWN0aW9uPFQ+LFxuICBhY3Rpb246IEVudGl0eUFjdGlvblxuKSA9PiBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xuXG4vKiogQ3JlYXRlIGEgZGVmYXVsdCByZWR1Y2VyIGZvciBhIHNwZWNpZmljIGVudGl0eSBjb2xsZWN0aW9uICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvblJlZHVjZXJGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2RzRmFjdG9yeTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXJNZXRob2RzRmFjdG9yeSkge31cblxuICAvKiogQ3JlYXRlIGEgZGVmYXVsdCByZWR1Y2VyIGZvciBhIGNvbGxlY3Rpb24gb2YgZW50aXRpZXMgb2YgVCAqL1xuICBjcmVhdGU8VCA9IGFueT4oZW50aXR5TmFtZTogc3RyaW5nKTogRW50aXR5Q29sbGVjdGlvblJlZHVjZXI8VD4ge1xuICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNGYWN0b3J5LmNyZWF0ZTxUPihlbnRpdHlOYW1lKTtcblxuICAgIC8qKiBQZXJmb3JtIEFjdGlvbnMgYWdhaW5zdCBhIHBhcnRpY3VsYXIgZW50aXR5IGNvbGxlY3Rpb24gaW4gdGhlIEVudGl0eUNhY2hlICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGVudGl0eUNvbGxlY3Rpb25SZWR1Y2VyKFxuICAgICAgY29sbGVjdGlvbjogRW50aXR5Q29sbGVjdGlvbjxUPixcbiAgICAgIGFjdGlvbjogRW50aXR5QWN0aW9uXG4gICAgKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gICAgICBjb25zdCByZWR1Y2VyTWV0aG9kID0gbWV0aG9kc1thY3Rpb24ucGF5bG9hZC5lbnRpdHlPcF07XG4gICAgICByZXR1cm4gcmVkdWNlck1ldGhvZCA/IHJlZHVjZXJNZXRob2QoY29sbGVjdGlvbiwgYWN0aW9uKSA6IGNvbGxlY3Rpb247XG4gICAgfTtcbiAgfVxufVxuIl19