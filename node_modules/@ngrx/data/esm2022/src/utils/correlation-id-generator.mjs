import { Injectable } from '@angular/core';
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
export class CorrelationIdGenerator {
    constructor() {
        /** Seed for the ids */
        this.seed = 0;
        /** Prefix of the id, 'CRID; */
        this.prefix = 'CRID';
    }
    /** Return the next correlation id */
    next() {
        this.seed += 1;
        return this.prefix + this.seed;
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: CorrelationIdGenerator, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycmVsYXRpb24taWQtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9jb3JyZWxhdGlvbi1pZC1nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0M7Ozs7Ozs7O0dBUUc7QUFFSCxNQUFNLE9BQU8sc0JBQXNCO0lBRG5DO1FBRUUsdUJBQXVCO1FBQ2IsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNuQiwrQkFBK0I7UUFDckIsV0FBTSxHQUFHLE1BQU0sQ0FBQztLQU0zQjtJQUxDLHFDQUFxQztJQUNyQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO2lJQVRVLHNCQUFzQjtxSUFBdEIsc0JBQXNCOzsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHN0cmluZyBpZCBiZWdpbm5pbmcgJ0NSSUQnLFxuICogZm9sbG93ZWQgYnkgYSBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgaW50ZWdlciBmb3IgdXNlIGFzIGEgY29ycmVsYXRpb24gaWQuXG4gKiBBcyB0aGV5IGFyZSBwcm9kdWNlZCBsb2NhbGx5IGJ5IGEgc2luZ2xldG9uIHNlcnZpY2UsXG4gKiB0aGVzZSBpZHMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW5pcXVlIG9ubHlcbiAqIGZvciB0aGUgZHVyYXRpb24gb2YgYSBzaW5nbGUgY2xpZW50IGJyb3dzZXIgaW5zdGFuY2UuXG4gKiBOZ3J4IGVudGl0eSBkaXNwYXRjaGVyIHF1ZXJ5IGFuZCBzYXZlIG1ldGhvZHMgY2FsbCB0aGlzIHNlcnZpY2UgdG8gZ2VuZXJhdGUgZGVmYXVsdCBjb3JyZWxhdGlvbiBpZHMuXG4gKiBEbyBOT1QgdXNlIGZvciBlbnRpdHkga2V5cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvcnJlbGF0aW9uSWRHZW5lcmF0b3Ige1xuICAvKiogU2VlZCBmb3IgdGhlIGlkcyAqL1xuICBwcm90ZWN0ZWQgc2VlZCA9IDA7XG4gIC8qKiBQcmVmaXggb2YgdGhlIGlkLCAnQ1JJRDsgKi9cbiAgcHJvdGVjdGVkIHByZWZpeCA9ICdDUklEJztcbiAgLyoqIFJldHVybiB0aGUgbmV4dCBjb3JyZWxhdGlvbiBpZCAqL1xuICBuZXh0KCkge1xuICAgIHRoaXMuc2VlZCArPSAxO1xuICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMuc2VlZDtcbiAgfVxufVxuIl19