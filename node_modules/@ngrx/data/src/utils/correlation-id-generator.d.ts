import * as i0 from "@angular/core";
/**
 * Generates a string id beginning 'CRID',
 * followed by a monotonically increasing integer for use as a correlation id.
 * As they are produced locally by a singleton service,
 * these ids are guaranteed to be unique only
 * for the duration of a single client browser instance.
 * Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
 * Do NOT use for entity keys.
 */
export declare class CorrelationIdGenerator {
    /** Seed for the ids */
    protected seed: number;
    /** Prefix of the id, 'CRID; */
    protected prefix: string;
    /** Return the next correlation id */
    next(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CorrelationIdGenerator, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CorrelationIdGenerator>;
}
