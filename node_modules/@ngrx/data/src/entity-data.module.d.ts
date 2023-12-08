import { ModuleWithProviders } from '@angular/core';
import { EntityDataModuleConfig } from './entity-data-config';
import * as i0 from "@angular/core";
import * as i1 from "./entity-data-without-effects.module";
/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
export declare class EntityDataModule {
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders<EntityDataModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDataModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<EntityDataModule, never, [typeof i1.EntityDataModuleWithoutEffects], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<EntityDataModule>;
}
