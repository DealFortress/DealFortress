import { NgModule } from '@angular/core';
import { EntityDataModuleWithoutEffects } from './entity-data-without-effects.module';
import { ENTITY_DATA_EFFECTS_PROVIDERS, provideEntityDataConfig, } from './provide-entity-data';
import * as i0 from "@angular/core";
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
export class EntityDataModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWRhdGEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9lbnRpdHktZGF0YS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEYsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix1QkFBdUIsR0FDeEIsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0I7Ozs7R0FJRztBQUtILE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FDWixNQUE4QjtRQUU5QixPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QyxDQUFDO0lBQ0osQ0FBQztpSUFSVSxnQkFBZ0I7a0lBQWhCLGdCQUFnQixZQUhqQiw4QkFBOEI7a0lBRzdCLGdCQUFnQixhQUZoQixDQUFDLDZCQUE2QixDQUFDLFlBRGhDLDhCQUE4Qjs7MkZBRzdCLGdCQUFnQjtrQkFKNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztvQkFDekMsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7aUJBQzNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eURhdGFNb2R1bGVDb25maWcgfSBmcm9tICcuL2VudGl0eS1kYXRhLWNvbmZpZyc7XG5pbXBvcnQgeyBFbnRpdHlEYXRhTW9kdWxlV2l0aG91dEVmZmVjdHMgfSBmcm9tICcuL2VudGl0eS1kYXRhLXdpdGhvdXQtZWZmZWN0cy5tb2R1bGUnO1xuaW1wb3J0IHtcbiAgRU5USVRZX0RBVEFfRUZGRUNUU19QUk9WSURFUlMsXG4gIHByb3ZpZGVFbnRpdHlEYXRhQ29uZmlnLFxufSBmcm9tICcuL3Byb3ZpZGUtZW50aXR5LWRhdGEnO1xuXG4vKipcbiAqIGVudGl0eS1kYXRhIG1haW4gbW9kdWxlIGluY2x1ZGVzIGVmZmVjdHMgYW5kIEhUVFAgZGF0YSBzZXJ2aWNlc1xuICogQ29uZmlndXJlIHdpdGggYGZvclJvb3RgLlxuICogTm8gYGZvckZlYXR1cmVgIHlldC5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0VudGl0eURhdGFNb2R1bGVXaXRob3V0RWZmZWN0c10sXG4gIHByb3ZpZGVyczogW0VOVElUWV9EQVRBX0VGRkVDVFNfUFJPVklERVJTXSxcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGNvbmZpZzogRW50aXR5RGF0YU1vZHVsZUNvbmZpZ1xuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEVudGl0eURhdGFNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVudGl0eURhdGFNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtwcm92aWRlRW50aXR5RGF0YUNvbmZpZyhjb25maWcpXSxcbiAgICB9O1xuICB9XG59XG4iXX0=