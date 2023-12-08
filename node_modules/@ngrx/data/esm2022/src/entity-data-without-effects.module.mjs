import { NgModule } from '@angular/core';
import { BASE_ENTITY_DATA_PROVIDERS, provideEntityDataConfig, } from './provide-entity-data';
import * as i0 from "@angular/core";
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
export class EntityDataModuleWithoutEffects {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZGF0YS9zcmMvZW50aXR5LWRhdGEtd2l0aG91dC1lZmZlY3RzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsMEJBQTBCLEVBQzFCLHVCQUF1QixHQUN4QixNQUFNLHVCQUF1QixDQUFDOztBQUUvQjs7Ozs7R0FLRztBQUlILE1BQU0sT0FBTyw4QkFBOEI7SUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FDWixNQUE4QjtRQUU5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLDhCQUE4QjtZQUN4QyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QyxDQUFDO0lBQ0osQ0FBQztpSUFSVSw4QkFBOEI7a0lBQTlCLDhCQUE4QjtrSUFBOUIsOEJBQThCLGFBRjlCLENBQUMsMEJBQTBCLENBQUM7OzJGQUU1Qiw4QkFBOEI7a0JBSDFDLFFBQVE7bUJBQUM7b0JBQ1IsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eURhdGFNb2R1bGVDb25maWcgfSBmcm9tICcuL2VudGl0eS1kYXRhLWNvbmZpZyc7XG5pbXBvcnQge1xuICBCQVNFX0VOVElUWV9EQVRBX1BST1ZJREVSUyxcbiAgcHJvdmlkZUVudGl0eURhdGFDb25maWcsXG59IGZyb20gJy4vcHJvdmlkZS1lbnRpdHktZGF0YSc7XG5cbi8qKlxuICogTW9kdWxlIHdpdGhvdXQgZWZmZWN0cyBvciBkYXRhc2VydmljZXMgd2hpY2ggbWVhbnMgbm8gSFRUUCBjYWxsc1xuICogVGhpcyBtb2R1bGUgaGVscGZ1bCBmb3IgaW50ZXJuYWwgdGVzdGluZy5cbiAqIEFsc28gaGVscGZ1bCBmb3IgYXBwcyB0aGF0IGhhbmRsZSBzZXJ2ZXIgYWNjZXNzIG9uIHRoZWlyIG93biBhbmRcbiAqIHRoZXJlZm9yZSBvcHQtb3V0IG9mIEBuZ3J4L2VmZmVjdHMgZm9yIGVudGl0aWVzXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW0JBU0VfRU5USVRZX0RBVEFfUFJPVklERVJTXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgY29uZmlnOiBFbnRpdHlEYXRhTW9kdWxlQ29uZmlnXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RW50aXR5RGF0YU1vZHVsZVdpdGhvdXRFZmZlY3RzPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMsXG4gICAgICBwcm92aWRlcnM6IFtwcm92aWRlRW50aXR5RGF0YUNvbmZpZyhjb25maWcpXSxcbiAgICB9O1xuICB9XG59XG4iXX0=