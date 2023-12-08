import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../utils/interfaces";
/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `DefaultHttpUrlGenerator`.
 */
export class EntityHttpResourceUrls {
}
/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 */
export class HttpUrlGenerator {
}
export class DefaultHttpUrlGenerator {
    constructor(pluralizer) {
        this.pluralizer = pluralizer;
        /**
         * Known single-entity and collection resource URLs for HTTP calls.
         * Generator methods returns these resource URLs for a given entity type name.
         * If the resources for an entity type name are not know, it generates
         * and caches a resource name for future use
         */
        this.knownHttpResourceUrls = {};
    }
    /**
     * Get or generate the entity and collection resource URLs for the given entity type name
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     */
    getResourceUrls(entityName, root, trailingSlashEndpoints = false) {
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            const nRoot = trailingSlashEndpoints ? root : normalizeRoot(root);
            resourceUrls = {
                entityResourceUrl: `${nRoot}/${entityName}/`.toLowerCase(),
                collectionResourceUrl: `${nRoot}/${this.pluralizer.pluralize(entityName)}/`.toLowerCase(),
            };
            this.registerHttpResourceUrls({ [entityName]: resourceUrls });
        }
        return resourceUrls;
    }
    /**
     * Create the path to a single entity resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName, root, trailingSlashEndpoints) {
        return this.getResourceUrls(entityName, root, trailingSlashEndpoints)
            .entityResourceUrl;
    }
    /**
     * Create the path to a multiple entity (collection) resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/heroes'
     */
    collectionResource(entityName, root) {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    }
    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityHttpResourceUrls {EntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     */
    registerHttpResourceUrls(entityHttpResourceUrls) {
        this.knownHttpResourceUrls = {
            ...this.knownHttpResourceUrls,
            ...(entityHttpResourceUrls || {}),
        };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, deps: [{ token: i1.Pluralizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultHttpUrlGenerator, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Pluralizer }] });
/** Remove leading & trailing spaces or slashes */
export function normalizeRoot(root) {
    return root.replace(/^[/\s]+|[/\s]+$/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC11cmwtZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy9kYXRhc2VydmljZXMvaHR0cC11cmwtZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0Isc0JBQXNCO0NBRTNDO0FBdUJEOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsZ0JBQWdCO0NBd0JyQztBQUdELE1BQU0sT0FBTyx1QkFBdUI7SUFTbEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVIxQzs7Ozs7V0FLRztRQUNPLDBCQUFxQixHQUEyQixFQUFFLENBQUM7SUFFaEIsQ0FBQztJQUU5Qzs7OztPQUlHO0lBQ08sZUFBZSxDQUN2QixVQUFrQixFQUNsQixJQUFZLEVBQ1osc0JBQXNCLEdBQUcsS0FBSztRQUU5QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEUsWUFBWSxHQUFHO2dCQUNiLGlCQUFpQixFQUFFLEdBQUcsS0FBSyxJQUFJLFVBQVUsR0FBRyxDQUFDLFdBQVcsRUFBRTtnQkFDMUQscUJBQXFCLEVBQUUsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzFELFVBQVUsQ0FDWCxHQUFHLENBQUMsV0FBVyxFQUFFO2FBQ25CLENBQUM7WUFDRixJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxjQUFjLENBQ1osVUFBa0IsRUFDbEIsSUFBWSxFQUNaLHNCQUErQjtRQUUvQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxzQkFBc0IsQ0FBQzthQUNsRSxpQkFBaUIsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxrQkFBa0IsQ0FBQyxVQUFrQixFQUFFLElBQVk7UUFDakQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx3QkFBd0IsQ0FDdEIsc0JBQThDO1FBRTlDLElBQUksQ0FBQyxxQkFBcUIsR0FBRztZQUMzQixHQUFHLElBQUksQ0FBQyxxQkFBcUI7WUFDN0IsR0FBRyxDQUFDLHNCQUFzQixJQUFJLEVBQUUsQ0FBQztTQUNsQyxDQUFDO0lBQ0osQ0FBQztpSUF6RVUsdUJBQXVCO3FJQUF2Qix1QkFBdUI7OzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVU7O0FBNkVYLGtEQUFrRDtBQUNsRCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQVk7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVyYWxpemVyIH0gZnJvbSAnLi4vdXRpbHMvaW50ZXJmYWNlcyc7XG5cbi8qKlxuICogS25vd24gcmVzb3VyY2UgVVJMUyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGVzLlxuICogRWFjaCBlbnRpdHkncyByZXNvdXJjZSBVUkxTIGFyZSBlbmRwb2ludHMgdGhhdFxuICogdGFyZ2V0IHNpbmdsZSBlbnRpdHkgYW5kIG11bHRpLWVudGl0eSBIVFRQIG9wZXJhdGlvbnMuXG4gKiBVc2VkIGJ5IHRoZSBgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3JgLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW50aXR5SHR0cFJlc291cmNlVXJscyB7XG4gIFtlbnRpdHlOYW1lOiBzdHJpbmddOiBIdHRwUmVzb3VyY2VVcmxzO1xufVxuXG4vKipcbiAqIFJlc291cmNlIFVSTFMgZm9yIEhUVFAgb3BlcmF0aW9ucyB0aGF0IHRhcmdldCBzaW5nbGUgZW50aXR5XG4gKiBhbmQgbXVsdGktZW50aXR5IGVuZHBvaW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdHRwUmVzb3VyY2VVcmxzIHtcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBzaW5nbGUgZW50aXR5IGVuZHBvaW50LCBlLmcsIGBzb21lLWFwaS1yb290L2hlcm8vYFxuICAgKiBzdWNoIGFzIHlvdSdkIHVzZSB0byBhZGQgYSBoZXJvLlxuICAgKiBFeGFtcGxlOiBgaHR0cENsaWVudC5wb3N0PEhlcm8+KCdzb21lLWFwaS1yb290L2hlcm8vJywgYWRkZWRIZXJvKWAuXG4gICAqIE5vdGUgdHJhaWxpbmcgc2xhc2ggKC8pLlxuICAgKi9cbiAgZW50aXR5UmVzb3VyY2VVcmw6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBVUkwgcGF0aCBmb3IgYSBtdWx0aXBsZS1lbnRpdHkgZW5kcG9pbnQsIGUuZywgYHNvbWUtYXBpLXJvb3QvaGVyb2VzL2BcbiAgICogc3VjaCBhcyB5b3UnZCB1c2Ugd2hlbiBnZXR0aW5nIGFsbCBoZXJvZXMuXG4gICAqIEV4YW1wbGU6IGBodHRwQ2xpZW50LmdldDxIZXJvW10+KCdzb21lLWFwaS1yb290L2hlcm9lcy8nKWBcbiAgICogTm90ZSB0cmFpbGluZyBzbGFzaCAoLykuXG4gICAqL1xuICBjb2xsZWN0aW9uUmVzb3VyY2VVcmw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgYmFzZSBwYXJ0IG9mIGFuIEhUVFAgVVJMIGZvclxuICogc2luZ2xlIGVudGl0eSBvciBlbnRpdHkgY29sbGVjdGlvbiByZXNvdXJjZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSHR0cFVybEdlbmVyYXRvciB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGJhc2UgVVJMIGZvciBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2UsXG4gICAqIGUuZy4sIHRoZSBiYXNlIFVSTCB0byBnZXQgYSBzaW5nbGUgaGVybyBieSBpdHMgaWRcbiAgICovXG4gIGFic3RyYWN0IGVudGl0eVJlc291cmNlKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmcsXG4gICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50czogYm9vbGVhblxuICApOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYmFzZSBVUkwgZm9yIGEgY29sbGVjdGlvbiByZXNvdXJjZSxcbiAgICogZS5nLiwgdGhlIGJhc2UgVVJMIHRvIGdldCBhbGwgaGVyb2VzXG4gICAqL1xuICBhYnN0cmFjdCBjb2xsZWN0aW9uUmVzb3VyY2UoZW50aXR5TmFtZTogc3RyaW5nLCByb290OiBzdHJpbmcpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICovXG4gIGFic3RyYWN0IHJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhcbiAgICBlbnRpdHlIdHRwUmVzb3VyY2VVcmxzPzogRW50aXR5SHR0cFJlc291cmNlVXJsc1xuICApOiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdEh0dHBVcmxHZW5lcmF0b3IgaW1wbGVtZW50cyBIdHRwVXJsR2VuZXJhdG9yIHtcbiAgLyoqXG4gICAqIEtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxscy5cbiAgICogR2VuZXJhdG9yIG1ldGhvZHMgcmV0dXJucyB0aGVzZSByZXNvdXJjZSBVUkxzIGZvciBhIGdpdmVuIGVudGl0eSB0eXBlIG5hbWUuXG4gICAqIElmIHRoZSByZXNvdXJjZXMgZm9yIGFuIGVudGl0eSB0eXBlIG5hbWUgYXJlIG5vdCBrbm93LCBpdCBnZW5lcmF0ZXNcbiAgICogYW5kIGNhY2hlcyBhIHJlc291cmNlIG5hbWUgZm9yIGZ1dHVyZSB1c2VcbiAgICovXG4gIHByb3RlY3RlZCBrbm93bkh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHMgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdXJhbGl6ZXI6IFBsdXJhbGl6ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEdldCBvciBnZW5lcmF0ZSB0aGUgZW50aXR5IGFuZCBjb2xsZWN0aW9uIHJlc291cmNlIFVSTHMgZm9yIHRoZSBnaXZlbiBlbnRpdHkgdHlwZSBuYW1lXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlLCBlLmcsICdIZXJvJ1xuICAgKiBAcGFyYW0gcm9vdCB7c3RyaW5nfSBSb290IHBhdGggdG8gdGhlIHJlc291cmNlLCBlLmcuLCAnc29tZS1hcGlgXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0UmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmcsXG4gICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA9IGZhbHNlXG4gICk6IEh0dHBSZXNvdXJjZVVybHMge1xuICAgIGxldCByZXNvdXJjZVVybHMgPSB0aGlzLmtub3duSHR0cFJlc291cmNlVXJsc1tlbnRpdHlOYW1lXTtcbiAgICBpZiAoIXJlc291cmNlVXJscykge1xuICAgICAgY29uc3QgblJvb3QgPSB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzID8gcm9vdCA6IG5vcm1hbGl6ZVJvb3Qocm9vdCk7XG4gICAgICByZXNvdXJjZVVybHMgPSB7XG4gICAgICAgIGVudGl0eVJlc291cmNlVXJsOiBgJHtuUm9vdH0vJHtlbnRpdHlOYW1lfS9gLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGNvbGxlY3Rpb25SZXNvdXJjZVVybDogYCR7blJvb3R9LyR7dGhpcy5wbHVyYWxpemVyLnBsdXJhbGl6ZShcbiAgICAgICAgICBlbnRpdHlOYW1lXG4gICAgICAgICl9L2AudG9Mb3dlckNhc2UoKSxcbiAgICAgIH07XG4gICAgICB0aGlzLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyh7IFtlbnRpdHlOYW1lXTogcmVzb3VyY2VVcmxzIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzb3VyY2VVcmxzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgcGF0aCB0byBhIHNpbmdsZSBlbnRpdHkgcmVzb3VyY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICogQHJldHVybnMgY29tcGxldGUgcGF0aCB0byByZXNvdXJjZSwgZS5nLCAnc29tZS1hcGkvaGVybydcbiAgICovXG4gIGVudGl0eVJlc291cmNlKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICByb290OiBzdHJpbmcsXG4gICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50czogYm9vbGVhblxuICApOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlVXJscyhlbnRpdHlOYW1lLCByb290LCB0cmFpbGluZ1NsYXNoRW5kcG9pbnRzKVxuICAgICAgLmVudGl0eVJlc291cmNlVXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgcGF0aCB0byBhIG11bHRpcGxlIGVudGl0eSAoY29sbGVjdGlvbikgcmVzb3VyY2VcbiAgICogQHBhcmFtIGVudGl0eU5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZW50aXR5IHR5cGUsIGUuZywgJ0hlcm8nXG4gICAqIEBwYXJhbSByb290IHtzdHJpbmd9IFJvb3QgcGF0aCB0byB0aGUgcmVzb3VyY2UsIGUuZy4sICdzb21lLWFwaWBcbiAgICogQHJldHVybnMgY29tcGxldGUgcGF0aCB0byByZXNvdXJjZSwgZS5nLCAnc29tZS1hcGkvaGVyb2VzJ1xuICAgKi9cbiAgY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWU6IHN0cmluZywgcm9vdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZVVybHMoZW50aXR5TmFtZSwgcm9vdCkuY29sbGVjdGlvblJlc291cmNlVXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGtub3duIHNpbmdsZS1lbnRpdHkgYW5kIGNvbGxlY3Rpb24gcmVzb3VyY2UgVVJMcyBmb3IgSFRUUCBjYWxsc1xuICAgKiBAcGFyYW0gZW50aXR5SHR0cFJlc291cmNlVXJscyB7RW50aXR5SHR0cFJlc291cmNlVXJsc30gcmVzb3VyY2UgdXJscyBmb3Igc3BlY2lmaWMgZW50aXR5IHR5cGUgbmFtZXNcbiAgICogV2VsbC1mb3JtZWQgcmVzb3VyY2UgdXJscyBlbmQgaW4gYSAnLyc7XG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGRvZXMgbm90IGVuc3VyZSB0aGF0IHJlc291cmNlIHVybHMgYXJlIHdlbGwtZm9ybWVkLlxuICAgKi9cbiAgcmVnaXN0ZXJIdHRwUmVzb3VyY2VVcmxzKFxuICAgIGVudGl0eUh0dHBSZXNvdXJjZVVybHM6IEVudGl0eUh0dHBSZXNvdXJjZVVybHNcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5rbm93bkh0dHBSZXNvdXJjZVVybHMgPSB7XG4gICAgICAuLi50aGlzLmtub3duSHR0cFJlc291cmNlVXJscyxcbiAgICAgIC4uLihlbnRpdHlIdHRwUmVzb3VyY2VVcmxzIHx8IHt9KSxcbiAgICB9O1xuICB9XG59XG5cbi8qKiBSZW1vdmUgbGVhZGluZyAmIHRyYWlsaW5nIHNwYWNlcyBvciBzbGFzaGVzICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplUm9vdChyb290OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJvb3QucmVwbGFjZSgvXlsvXFxzXSt8Wy9cXHNdKyQvZywgJycpO1xufVxuIl19