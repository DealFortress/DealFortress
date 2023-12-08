import { EnvironmentProviders, Provider } from '@angular/core';
import { EntityDataModuleConfig } from './entity-data-config';
export declare const BASE_ENTITY_DATA_PROVIDERS: Provider[];
export declare const ENTITY_DATA_EFFECTS_PROVIDERS: Provider[];
export declare function provideEntityDataConfig(config: EntityDataModuleConfig): Provider[];
/**
 * Sets up base entity data providers with entity config.
 * This function should to be used at the root level.
 *
 * @usageNotes
 *
 * ### Providing entity data with effects
 *
 * When used with `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModule.forRoot`
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { provideEffects } from '@ngrx/effects';
 * import {
 *   EntityMetadataMap,
 *   provideEntityData,
 *   withEffects,
 * } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Hero: {},
 *   Villain: {},
 * };
 * const pluralNames = { Hero: 'Heroes' };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEffects(),
 *     provideEntityData({ entityMetadata, pluralNames }, withEffects()),
 *   ],
 * });
 * ```
 *
 * ### Providing entity data without effects
 *
 * When used without `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModuleWithoutEffects.forRoot`.
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { EntityMetadataMap, provideEntityData } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Musician: {},
 *   Song: {},
 * };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEntityData({ entityMetadata }),
 *   ],
 * });
 * ```
 *
 */
export declare function provideEntityData(config: EntityDataModuleConfig, ...features: EntityDataFeature[]): EnvironmentProviders;
declare enum EntityDataFeatureKind {
    WithEffects = 0
}
interface EntityDataFeature {
    ɵkind: EntityDataFeatureKind;
    ɵproviders: Provider[];
}
/**
 * Registers entity data effects and provides HTTP data services.
 *
 * @see `provideEntityData`
 */
export declare function withEffects(): EntityDataFeature;
export {};
