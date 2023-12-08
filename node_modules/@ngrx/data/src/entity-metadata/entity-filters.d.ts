/**
 * Filters the `entities` array argument and returns the original `entities`,
 * or a new filtered array of entities.
 * NEVER mutate the original `entities` array itself.
 **/
export type EntityFilterFn<T> = (entities: T[], pattern?: any) => T[];
/**
 * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
 * anywhere in any of the given props of an entity.
 * If pattern is a string, spaces are significant and ignores case.
 */
export declare function PropsFilterFnFactory<T = any>(props?: (keyof T)[]): EntityFilterFn<T>;
