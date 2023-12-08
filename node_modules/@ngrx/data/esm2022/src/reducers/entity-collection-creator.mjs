import { Injectable, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../entity-metadata/entity-definition.service";
export class EntityCollectionCreator {
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator, deps: [{ token: i1.EntityDefinitionService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: EntityCollectionCreator, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.EntityDefinitionService, decorators: [{
                    type: Optional
                }] }] });
export function createEmptyEntityCollection(entityName) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvcmVkdWNlcnMvZW50aXR5LWNvbGxlY3Rpb24tY3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTXJELE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFDc0IsdUJBQWlEO1FBQWpELDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBMEI7SUFDcEUsQ0FBQztJQUVKOzs7T0FHRztJQUNILE1BQU0sQ0FDSixVQUFrQjtRQUVsQixNQUFNLEdBQUcsR0FDUCxJQUFJLENBQUMsdUJBQXVCO1lBQzVCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQ3hDLFVBQVUsRUFDVixLQUFLLENBQUMsZUFBZSxDQUN0QixDQUFDO1FBRUosTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFFN0MsT0FBVSxDQUFDLFlBQVksSUFBSSwyQkFBMkIsQ0FBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7aUlBdEJVLHVCQUF1QjtxSUFBdkIsdUJBQXVCOzsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVOzswQkFHTixRQUFROztBQXVCYixNQUFNLFVBQVUsMkJBQTJCLENBQ3pDLFVBQW1CO0lBRW5CLE9BQU87UUFDTCxVQUFVO1FBQ1YsR0FBRyxFQUFFLEVBQUU7UUFDUCxRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLEtBQUs7UUFDZCxXQUFXLEVBQUUsRUFBRTtLQUNPLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL2VudGl0eS1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEVudGl0eURlZmluaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZW50aXR5LW1ldGFkYXRhL2VudGl0eS1kZWZpbml0aW9uLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5Q29sbGVjdGlvbkNyZWF0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGVudGl0eURlZmluaXRpb25TZXJ2aWNlPzogRW50aXR5RGVmaW5pdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGRlZmF1bHQgY29sbGVjdGlvbiBmb3IgYW4gZW50aXR5IHR5cGUuXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IGVudGl0eSB0eXBlIG5hbWVcbiAgICovXG4gIGNyZWF0ZTxUID0gYW55LCBTIGV4dGVuZHMgRW50aXR5Q29sbGVjdGlvbjxUPiA9IEVudGl0eUNvbGxlY3Rpb248VD4+KFxuICAgIGVudGl0eU5hbWU6IHN0cmluZ1xuICApOiBTIHtcbiAgICBjb25zdCBkZWYgPVxuICAgICAgdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZSAmJlxuICAgICAgdGhpcy5lbnRpdHlEZWZpbml0aW9uU2VydmljZS5nZXREZWZpbml0aW9uPFQ+KFxuICAgICAgICBlbnRpdHlOYW1lLFxuICAgICAgICBmYWxzZSAvKnNob3VsZFRocm93Ki9cbiAgICAgICk7XG5cbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBkZWYgJiYgZGVmLmluaXRpYWxTdGF0ZTtcblxuICAgIHJldHVybiA8Uz4oaW5pdGlhbFN0YXRlIHx8IGNyZWF0ZUVtcHR5RW50aXR5Q29sbGVjdGlvbjxUPihlbnRpdHlOYW1lKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVtcHR5RW50aXR5Q29sbGVjdGlvbjxUPihcbiAgZW50aXR5TmFtZT86IHN0cmluZ1xuKTogRW50aXR5Q29sbGVjdGlvbjxUPiB7XG4gIHJldHVybiB7XG4gICAgZW50aXR5TmFtZSxcbiAgICBpZHM6IFtdLFxuICAgIGVudGl0aWVzOiB7fSxcbiAgICBmaWx0ZXI6IHVuZGVmaW5lZCxcbiAgICBsb2FkZWQ6IGZhbHNlLFxuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGNoYW5nZVN0YXRlOiB7fSxcbiAgfSBhcyBFbnRpdHlDb2xsZWN0aW9uPFQ+O1xufVxuIl19