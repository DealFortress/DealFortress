import { InjectionToken } from '@angular/core';
export declare abstract class Logger {
    abstract error(message?: any, ...optionalParams: any[]): void;
    abstract log(message?: any, ...optionalParams: any[]): void;
    abstract warn(message?: any, ...optionalParams: any[]): void;
}
/**
 * Mapping of entity type name to its plural
 */
export interface EntityPluralNames {
    [entityName: string]: string;
}
export declare const PLURAL_NAMES_TOKEN: InjectionToken<EntityPluralNames>;
export declare abstract class Pluralizer {
    abstract pluralize(name: string): string;
}
