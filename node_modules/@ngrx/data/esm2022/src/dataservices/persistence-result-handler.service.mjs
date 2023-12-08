import { Injectable } from '@angular/core';
import { DataServiceError, } from './data-service-error';
import { makeErrorOp, makeSuccessOp } from '../actions/entity-op';
import * as i0 from "@angular/core";
import * as i1 from "../utils/interfaces";
import * as i2 from "../actions/entity-action-factory";
/**
 * Handling of responses from persistence operation
 */
export class PersistenceResultHandler {
}
/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
export class DefaultPersistenceResultHandler {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, deps: [{ token: i1.Logger }, { token: i2.EntityActionFactory }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPersistenceResultHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Logger }, { type: i2.EntityActionFactory }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc2lzdGVuY2UtcmVzdWx0LWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZGF0YXNlcnZpY2VzL3BlcnNpc3RlbmNlLXJlc3VsdC1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQ0wsZ0JBQWdCLEdBRWpCLE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsT0FBTyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQUdsRTs7R0FFRztBQUNILE1BQU0sT0FBZ0Isd0JBQXdCO0NBVTdDO0FBRUQ7OztHQUdHO0FBRUgsTUFBTSxPQUFPLCtCQUErQjtJQUcxQyxZQUNVLE1BQWMsRUFDZCxtQkFBd0M7UUFEeEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFDL0MsQ0FBQztJQUVKLDJFQUEyRTtJQUMzRSxhQUFhLENBQUMsY0FBNEI7UUFDeEMsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsT0FBTyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUU7WUFDeEQsUUFBUSxFQUFFLFNBQVM7WUFDbkIsSUFBSTtTQUNMLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsV0FBVyxDQUNULGNBQTRCO1FBSTVCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELE9BQU8sQ0FBQyxHQUE2QixFQUFFLEVBQUU7WUFDdkMsTUFBTSxLQUFLLEdBQ1QsR0FBRyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFFLE1BQU0sU0FBUyxHQUFpQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQztZQUMxRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QixNQUFNLE1BQU0sR0FDVixJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQ3ZDLGNBQWMsRUFDZDtnQkFDRSxRQUFRLEVBQUUsT0FBTztnQkFDakIsSUFBSSxFQUFFLFNBQVM7YUFDaEIsQ0FDRixDQUFDO1lBQ0osT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztpSUF6Q1UsK0JBQStCO3FJQUEvQiwrQkFBK0I7OzJGQUEvQiwrQkFBK0I7a0JBRDNDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7XG4gIERhdGFTZXJ2aWNlRXJyb3IsXG4gIEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IsXG59IGZyb20gJy4vZGF0YS1zZXJ2aWNlLWVycm9yJztcbmltcG9ydCB7IEVudGl0eUFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbnMvZW50aXR5LWFjdGlvbic7XG5pbXBvcnQgeyBFbnRpdHlBY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vYWN0aW9ucy9lbnRpdHktYWN0aW9uLWZhY3RvcnknO1xuaW1wb3J0IHsgbWFrZUVycm9yT3AsIG1ha2VTdWNjZXNzT3AgfSBmcm9tICcuLi9hY3Rpb25zL2VudGl0eS1vcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi91dGlscy9pbnRlcmZhY2VzJztcblxuLyoqXG4gKiBIYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBlcnNpc3RlbmNlUmVzdWx0SGFuZGxlciB7XG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIGZvciBhbiBhY3Rpb24gKi9cbiAgYWJzdHJhY3QgaGFuZGxlU3VjY2VzcyhvcmlnaW5hbEFjdGlvbjogRW50aXR5QWN0aW9uKTogKGRhdGE6IGFueSkgPT4gQWN0aW9uO1xuXG4gIC8qKiBIYW5kbGUgZXJyb3IgcmVzdWx0IG9mIHBlcnNpc3RlbmNlIG9wZXJhdGlvbiBmb3IgYW4gYWN0aW9uICovXG4gIGFic3RyYWN0IGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj47XG59XG5cbi8qKlxuICogRGVmYXVsdCBoYW5kbGluZyBvZiByZXNwb25zZXMgZnJvbSBwZXJzaXN0ZW5jZSBvcGVyYXRpb24sXG4gKiBzcGVjaWZpY2FsbHkgYW4gRW50aXR5RGF0YVNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXJcbiAgaW1wbGVtZW50cyBQZXJzaXN0ZW5jZVJlc3VsdEhhbmRsZXJcbntcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlcixcbiAgICBwcml2YXRlIGVudGl0eUFjdGlvbkZhY3Rvcnk6IEVudGl0eUFjdGlvbkZhY3RvcnlcbiAgKSB7fVxuXG4gIC8qKiBIYW5kbGUgc3VjY2Vzc2Z1bCByZXN1bHQgb2YgcGVyc2lzdGVuY2Ugb3BlcmF0aW9uIG9uIGFuIEVudGl0eUFjdGlvbiAqL1xuICBoYW5kbGVTdWNjZXNzKG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb24pOiAoZGF0YTogYW55KSA9PiBBY3Rpb24ge1xuICAgIGNvbnN0IHN1Y2Nlc3NPcCA9IG1ha2VTdWNjZXNzT3Aob3JpZ2luYWxBY3Rpb24ucGF5bG9hZC5lbnRpdHlPcCk7XG4gICAgcmV0dXJuIChkYXRhOiBhbnkpID0+XG4gICAgICB0aGlzLmVudGl0eUFjdGlvbkZhY3RvcnkuY3JlYXRlRnJvbUFjdGlvbihvcmlnaW5hbEFjdGlvbiwge1xuICAgICAgICBlbnRpdHlPcDogc3VjY2Vzc09wLFxuICAgICAgICBkYXRhLFxuICAgICAgfSk7XG4gIH1cblxuICAvKiogSGFuZGxlIGVycm9yIHJlc3VsdCBvZiBwZXJzaXN0ZW5jZSBvcGVyYXRpb24gb24gYW4gRW50aXR5QWN0aW9uICovXG4gIGhhbmRsZUVycm9yKFxuICAgIG9yaWdpbmFsQWN0aW9uOiBFbnRpdHlBY3Rpb25cbiAgKTogKFxuICAgIGVycm9yOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3JcbiAgKSA9PiBFbnRpdHlBY3Rpb248RW50aXR5QWN0aW9uRGF0YVNlcnZpY2VFcnJvcj4ge1xuICAgIGNvbnN0IGVycm9yT3AgPSBtYWtlRXJyb3JPcChvcmlnaW5hbEFjdGlvbi5wYXlsb2FkLmVudGl0eU9wKTtcblxuICAgIHJldHVybiAoZXJyOiBEYXRhU2VydmljZUVycm9yIHwgRXJyb3IpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID1cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgRGF0YVNlcnZpY2VFcnJvciA/IGVyciA6IG5ldyBEYXRhU2VydmljZUVycm9yKGVyciwgbnVsbCk7XG4gICAgICBjb25zdCBlcnJvckRhdGE6IEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3IgPSB7IGVycm9yLCBvcmlnaW5hbEFjdGlvbiB9O1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3JEYXRhKTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9XG4gICAgICAgIHRoaXMuZW50aXR5QWN0aW9uRmFjdG9yeS5jcmVhdGVGcm9tQWN0aW9uPEVudGl0eUFjdGlvbkRhdGFTZXJ2aWNlRXJyb3I+KFxuICAgICAgICAgIG9yaWdpbmFsQWN0aW9uLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVudGl0eU9wOiBlcnJvck9wLFxuICAgICAgICAgICAgZGF0YTogZXJyb3JEYXRhLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfTtcbiAgfVxufVxuIl19