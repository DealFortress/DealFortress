import { ModuleWithProviders } from '@angular/core';
import { EntityDataModuleConfig } from './entity-data-config';
import * as i0 from "@angular/core";
/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
export declare class EntityDataModuleWithoutEffects {
    static forRoot(config: EntityDataModuleConfig): ModuleWithProviders<EntityDataModuleWithoutEffects>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityDataModuleWithoutEffects, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<EntityDataModuleWithoutEffects, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<EntityDataModuleWithoutEffects>;
}
