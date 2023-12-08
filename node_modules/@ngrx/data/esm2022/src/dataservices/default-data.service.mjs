import { Injectable, isDevMode, Optional } from '@angular/core';
import { HttpHeaders, HttpParams, } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';
import { DataServiceError } from './data-service-error';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./http-url-generator";
import * as i3 from "./default-data-service-config";
/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
export class DefaultDataService {
    get name() {
        return this._name;
    }
    constructor(entityName, http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.getDelay = 0;
        this.saveDelay = 0;
        this.timeout = 0;
        this.trailingSlashEndpoints = false;
        this._name = `${entityName} DefaultDataService`;
        this.entityName = entityName;
        const { root = 'api', delete404OK = true, getDelay = 0, saveDelay = 0, timeout: to = 0, trailingSlashEndpoints = false, } = config || {};
        this.delete404OK = delete404OK;
        this.entityUrl = httpUrlGenerator.entityResource(entityName, root, trailingSlashEndpoints);
        this.entitiesUrl = httpUrlGenerator.collectionResource(entityName, root);
        this.getDelay = getDelay;
        this.saveDelay = saveDelay;
        this.timeout = to;
    }
    add(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    delete(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to delete`);
        }
        return this.execute('DELETE', this.entityUrl + key, err, null, options).pipe(
        // forward the id of deleted entity as the result of the HTTP DELETE
        map((result) => key));
    }
    getAll(options) {
        return this.execute('GET', this.entitiesUrl, null, null, options);
    }
    getById(key, options) {
        let err;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to get`);
        }
        return this.execute('GET', this.entityUrl + key, err, null, options);
    }
    getWithQuery(queryParams, options) {
        const qParams = typeof queryParams === 'string'
            ? { fromString: queryParams }
            : { fromObject: queryParams };
        const params = new HttpParams(qParams);
        return this.execute('GET', this.entitiesUrl, undefined, { params }, options);
    }
    update(update, options) {
        const id = update && update.id;
        const updateOrError = id == null
            ? new Error(`No "${this.entityName}" update data or id`)
            : update.changes;
        return this.execute('PUT', this.entityUrl + id, updateOrError, null, options);
    }
    // Important! Only call if the backend service supports upserts as a POST to the target URL
    upsert(entity, options) {
        const entityOrError = entity || new Error(`No "${this.entityName}" entity to upsert`);
        return this.execute('POST', this.entityUrl, entityOrError, null, options);
    }
    execute(method, url, data, // data, error, or undefined/null
    options, // options or undefined/null
    httpOptions // these override any options passed via options
    ) {
        let entityActionHttpClientOptions = undefined;
        if (httpOptions) {
            entityActionHttpClientOptions = {
                headers: httpOptions?.httpHeaders
                    ? new HttpHeaders(httpOptions?.httpHeaders)
                    : undefined,
                params: httpOptions?.httpParams
                    ? new HttpParams(httpOptions?.httpParams)
                    : undefined,
            };
        }
        // Now we may have:
        // options: containing headers, params, or any other allowed http options already in angular's api
        // entityActionHttpClientOptions: headers and params in angular's api
        // We therefore need to merge these so that the action ones override the
        // existing keys where applicable.
        // If any options have been specified, pass them to http client. Note
        // the new http options, if specified, will override any options passed
        // from the deprecated options parameter
        let mergedOptions = undefined;
        if (options || entityActionHttpClientOptions) {
            if (isDevMode() && options && entityActionHttpClientOptions) {
                console.warn('@ngrx/data: options.httpParams will be merged with queryParams when both are are provided to getWithQuery(). In the event of a conflict HttpOptions.httpParams will override queryParams`. The queryParams parameter of getWithQuery() will be removed in next major release.');
            }
            mergedOptions = {
                ...options,
                headers: entityActionHttpClientOptions?.headers ?? options?.headers,
                params: entityActionHttpClientOptions?.params ?? options?.params,
            };
        }
        const req = {
            method,
            url,
            data,
            options: mergedOptions,
        };
        if (data instanceof Error) {
            return this.handleError(req)(data);
        }
        let result$;
        switch (method) {
            case 'DELETE': {
                result$ = this.http.delete(url, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            case 'GET': {
                result$ = this.http.get(url, mergedOptions);
                if (this.getDelay) {
                    result$ = result$.pipe(delay(this.getDelay));
                }
                break;
            }
            case 'POST': {
                result$ = this.http.post(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            // N.B.: It must return an Update<T>
            case 'PUT': {
                result$ = this.http.put(url, data, mergedOptions);
                if (this.saveDelay) {
                    result$ = result$.pipe(delay(this.saveDelay));
                }
                break;
            }
            default: {
                const error = new Error('Unimplemented HTTP method, ' + method);
                result$ = throwError(error);
            }
        }
        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout + this.saveDelay));
        }
        return result$.pipe(catchError(this.handleError(req)));
    }
    handleError(reqData) {
        return (err) => {
            const ok = this.handleDelete404(err, reqData);
            if (ok) {
                return ok;
            }
            const error = new DataServiceError(err, reqData);
            return throwError(error);
        };
    }
    handleDelete404(error, reqData) {
        if (error.status === 404 &&
            reqData.method === 'DELETE' &&
            this.delete404OK) {
            return of({});
        }
        return undefined;
    }
}
/**
 * Create a basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
export class DefaultDataServiceFactory {
    constructor(http, httpUrlGenerator, config) {
        this.http = http;
        this.httpUrlGenerator = httpUrlGenerator;
        this.config = config;
        config = config || {};
        httpUrlGenerator.registerHttpResourceUrls(config.entityHttpResourceUrls);
    }
    /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @param entityName {string} Name of the entity type for this data service
     */
    create(entityName) {
        return new DefaultDataService(entityName, this.http, this.httpUrlGenerator, this.config);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory, deps: [{ token: i1.HttpClient }, { token: i2.HttpUrlGenerator }, { token: i3.DefaultDataServiceConfig, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultDataServiceFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.HttpUrlGenerator }, { type: i3.DefaultDataServiceConfig, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL2RhdGFzZXJ2aWNlcy9kZWZhdWx0LWRhdGEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUdMLFdBQVcsRUFDWCxVQUFVLEdBQ1gsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQWMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBV3hEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0lBVzdCLElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFDRSxVQUFrQixFQUNSLElBQWdCLEVBQ2hCLGdCQUFrQyxFQUM1QyxNQUFpQztRQUZ2QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFacEMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBWXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLHFCQUFxQixDQUFDO1FBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLE1BQU0sRUFDSixJQUFJLEdBQUcsS0FBSyxFQUNaLFdBQVcsR0FBRyxJQUFJLEVB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QixDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBSSxVQUFrQjtRQUMxQixPQUFPLElBQUksa0JBQWtCLENBQzNCLFVBQVUsRUFDVixJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO0lBQ0osQ0FBQztpSUFyQlUseUJBQXlCO3FJQUF6Qix5QkFBeUI7OzJGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVU7OzBCQUtOLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBpc0Rldk1vZGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwQ2xpZW50LFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cEhlYWRlcnMsXG4gIEh0dHBQYXJhbXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGRlbGF5LCBtYXAsIHRpbWVvdXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFVwZGF0ZSB9IGZyb20gJ0BuZ3J4L2VudGl0eSc7XG5cbmltcG9ydCB7IERhdGFTZXJ2aWNlRXJyb3IgfSBmcm9tICcuL2RhdGEtc2VydmljZS1lcnJvcic7XG5pbXBvcnQgeyBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWcgfSBmcm9tICcuL2RlZmF1bHQtZGF0YS1zZXJ2aWNlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBFbnRpdHlDb2xsZWN0aW9uRGF0YVNlcnZpY2UsXG4gIEh0dHBNZXRob2RzLFxuICBIdHRwT3B0aW9ucyxcbiAgUXVlcnlQYXJhbXMsXG4gIFJlcXVlc3REYXRhLFxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSHR0cFVybEdlbmVyYXRvciB9IGZyb20gJy4vaHR0cC11cmwtZ2VuZXJhdG9yJztcblxuLyoqXG4gKiBBIGJhc2ljLCBnZW5lcmljIGVudGl0eSBkYXRhIHNlcnZpY2VcbiAqIHN1aXRhYmxlIGZvciBwZXJzaXN0ZW5jZSBvZiBtb3N0IGVudGl0aWVzLlxuICogQXNzdW1lcyBhIGNvbW1vbiBSRVNULXkgd2ViIEFQSVxuICovXG5leHBvcnQgY2xhc3MgRGVmYXVsdERhdGFTZXJ2aWNlPFQ+IGltcGxlbWVudHMgRW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlPFQ+IHtcbiAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkZWxldGU0MDRPSzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGVudGl0eU5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVudGl0eVVybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXRpZXNVcmw6IHN0cmluZztcbiAgcHJvdGVjdGVkIGdldERlbGF5ID0gMDtcbiAgcHJvdGVjdGVkIHNhdmVEZWxheSA9IDA7XG4gIHByb3RlY3RlZCB0aW1lb3V0ID0gMDtcbiAgcHJvdGVjdGVkIHRyYWlsaW5nU2xhc2hFbmRwb2ludHMgPSBmYWxzZTtcblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVudGl0eU5hbWU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBjb25maWc/OiBEZWZhdWx0RGF0YVNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5fbmFtZSA9IGAke2VudGl0eU5hbWV9IERlZmF1bHREYXRhU2VydmljZWA7XG4gICAgdGhpcy5lbnRpdHlOYW1lID0gZW50aXR5TmFtZTtcbiAgICBjb25zdCB7XG4gICAgICByb290ID0gJ2FwaScsXG4gICAgICBkZWxldGU0MDRPSyA9IHRydWUsXG4gICAgICBnZXREZWxheSA9IDAsXG4gICAgICBzYXZlRGVsYXkgPSAwLFxuICAgICAgdGltZW91dDogdG8gPSAwLFxuICAgICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50cyA9IGZhbHNlLFxuICAgIH0gPSBjb25maWcgfHwge307XG4gICAgdGhpcy5kZWxldGU0MDRPSyA9IGRlbGV0ZTQwNE9LO1xuICAgIHRoaXMuZW50aXR5VXJsID0gaHR0cFVybEdlbmVyYXRvci5lbnRpdHlSZXNvdXJjZShcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICByb290LFxuICAgICAgdHJhaWxpbmdTbGFzaEVuZHBvaW50c1xuICAgICk7XG4gICAgdGhpcy5lbnRpdGllc1VybCA9IGh0dHBVcmxHZW5lcmF0b3IuY29sbGVjdGlvblJlc291cmNlKGVudGl0eU5hbWUsIHJvb3QpO1xuICAgIHRoaXMuZ2V0RGVsYXkgPSBnZXREZWxheTtcbiAgICB0aGlzLnNhdmVEZWxheSA9IHNhdmVEZWxheTtcbiAgICB0aGlzLnRpbWVvdXQgPSB0bztcbiAgfVxuXG4gIGFkZChlbnRpdHk6IFQsIG9wdGlvbnM/OiBIdHRwT3B0aW9ucyk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGVudGl0eU9yRXJyb3IgPVxuICAgICAgZW50aXR5IHx8IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBlbnRpdHkgdG8gYWRkYCk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnUE9TVCcsIHRoaXMuZW50aXR5VXJsLCBlbnRpdHlPckVycm9yLCBudWxsLCBvcHRpb25zKTtcbiAgfVxuXG4gIGRlbGV0ZShcbiAgICBrZXk6IG51bWJlciB8IHN0cmluZyxcbiAgICBvcHRpb25zPzogSHR0cE9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxudW1iZXIgfCBzdHJpbmc+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZGVsZXRlYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShcbiAgICAgICdERUxFVEUnLFxuICAgICAgdGhpcy5lbnRpdHlVcmwgKyBrZXksXG4gICAgICBlcnIsXG4gICAgICBudWxsLFxuICAgICAgb3B0aW9uc1xuICAgICkucGlwZShcbiAgICAgIC8vIGZvcndhcmQgdGhlIGlkIG9mIGRlbGV0ZWQgZW50aXR5IGFzIHRoZSByZXN1bHQgb2YgdGhlIEhUVFAgREVMRVRFXG4gICAgICBtYXAoKHJlc3VsdCkgPT4ga2V5IGFzIG51bWJlciB8IHN0cmluZylcbiAgICApO1xuICB9XG5cbiAgZ2V0QWxsKG9wdGlvbnM/OiBIdHRwT3B0aW9ucyk6IE9ic2VydmFibGU8VFtdPiB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZSgnR0VUJywgdGhpcy5lbnRpdGllc1VybCwgbnVsbCwgbnVsbCwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXRCeUlkKGtleTogbnVtYmVyIHwgc3RyaW5nLCBvcHRpb25zPzogSHR0cE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBsZXQgZXJyOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcihgTm8gXCIke3RoaXMuZW50aXR5TmFtZX1cIiBrZXkgdG8gZ2V0YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoJ0dFVCcsIHRoaXMuZW50aXR5VXJsICsga2V5LCBlcnIsIG51bGwsIG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0V2l0aFF1ZXJ5KFxuICAgIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyB8IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBvcHRpb25zPzogSHR0cE9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICBjb25zdCBxUGFyYW1zID1cbiAgICAgIHR5cGVvZiBxdWVyeVBhcmFtcyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7IGZyb21TdHJpbmc6IHF1ZXJ5UGFyYW1zIH1cbiAgICAgICAgOiB7IGZyb21PYmplY3Q6IHF1ZXJ5UGFyYW1zIH07XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMocVBhcmFtcyk7XG5cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKFxuICAgICAgJ0dFVCcsXG4gICAgICB0aGlzLmVudGl0aWVzVXJsLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgeyBwYXJhbXMgfSxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9XG5cbiAgdXBkYXRlKHVwZGF0ZTogVXBkYXRlPFQ+LCBvcHRpb25zPzogSHR0cE9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBpZCA9IHVwZGF0ZSAmJiB1cGRhdGUuaWQ7XG4gICAgY29uc3QgdXBkYXRlT3JFcnJvciA9XG4gICAgICBpZCA9PSBudWxsXG4gICAgICAgID8gbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIHVwZGF0ZSBkYXRhIG9yIGlkYClcbiAgICAgICAgOiB1cGRhdGUuY2hhbmdlcztcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKFxuICAgICAgJ1BVVCcsXG4gICAgICB0aGlzLmVudGl0eVVybCArIGlkLFxuICAgICAgdXBkYXRlT3JFcnJvcixcbiAgICAgIG51bGwsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfVxuXG4gIC8vIEltcG9ydGFudCEgT25seSBjYWxsIGlmIHRoZSBiYWNrZW5kIHNlcnZpY2Ugc3VwcG9ydHMgdXBzZXJ0cyBhcyBhIFBPU1QgdG8gdGhlIHRhcmdldCBVUkxcbiAgdXBzZXJ0KGVudGl0eTogVCwgb3B0aW9ucz86IEh0dHBPcHRpb25zKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZW50aXR5T3JFcnJvciA9XG4gICAgICBlbnRpdHkgfHwgbmV3IEVycm9yKGBObyBcIiR7dGhpcy5lbnRpdHlOYW1lfVwiIGVudGl0eSB0byB1cHNlcnRgKTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKCdQT1NUJywgdGhpcy5lbnRpdHlVcmwsIGVudGl0eU9yRXJyb3IsIG51bGwsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGV4ZWN1dGUoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kcyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LCAvLyBkYXRhLCBlcnJvciwgb3IgdW5kZWZpbmVkL251bGxcbiAgICBvcHRpb25zPzogYW55LCAvLyBvcHRpb25zIG9yIHVuZGVmaW5lZC9udWxsXG4gICAgaHR0cE9wdGlvbnM/OiBIdHRwT3B0aW9ucyAvLyB0aGVzZSBvdmVycmlkZSBhbnkgb3B0aW9ucyBwYXNzZWQgdmlhIG9wdGlvbnNcbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnM6IGFueSA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaHR0cE9wdGlvbnMpIHtcbiAgICAgIGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zID0ge1xuICAgICAgICBoZWFkZXJzOiBodHRwT3B0aW9ucz8uaHR0cEhlYWRlcnNcbiAgICAgICAgICA/IG5ldyBIdHRwSGVhZGVycyhodHRwT3B0aW9ucz8uaHR0cEhlYWRlcnMpXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIHBhcmFtczogaHR0cE9wdGlvbnM/Lmh0dHBQYXJhbXNcbiAgICAgICAgICA/IG5ldyBIdHRwUGFyYW1zKGh0dHBPcHRpb25zPy5odHRwUGFyYW1zKVxuICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgbWF5IGhhdmU6XG4gICAgLy8gb3B0aW9uczogY29udGFpbmluZyBoZWFkZXJzLCBwYXJhbXMsIG9yIGFueSBvdGhlciBhbGxvd2VkIGh0dHAgb3B0aW9ucyBhbHJlYWR5IGluIGFuZ3VsYXIncyBhcGlcbiAgICAvLyBlbnRpdHlBY3Rpb25IdHRwQ2xpZW50T3B0aW9uczogaGVhZGVycyBhbmQgcGFyYW1zIGluIGFuZ3VsYXIncyBhcGlcblxuICAgIC8vIFdlIHRoZXJlZm9yZSBuZWVkIHRvIG1lcmdlIHRoZXNlIHNvIHRoYXQgdGhlIGFjdGlvbiBvbmVzIG92ZXJyaWRlIHRoZVxuICAgIC8vIGV4aXN0aW5nIGtleXMgd2hlcmUgYXBwbGljYWJsZS5cblxuICAgIC8vIElmIGFueSBvcHRpb25zIGhhdmUgYmVlbiBzcGVjaWZpZWQsIHBhc3MgdGhlbSB0byBodHRwIGNsaWVudC4gTm90ZVxuICAgIC8vIHRoZSBuZXcgaHR0cCBvcHRpb25zLCBpZiBzcGVjaWZpZWQsIHdpbGwgb3ZlcnJpZGUgYW55IG9wdGlvbnMgcGFzc2VkXG4gICAgLy8gZnJvbSB0aGUgZGVwcmVjYXRlZCBvcHRpb25zIHBhcmFtZXRlclxuICAgIGxldCBtZXJnZWRPcHRpb25zOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgaWYgKG9wdGlvbnMgfHwgZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnMpIHtcbiAgICAgIGlmIChpc0Rldk1vZGUoKSAmJiBvcHRpb25zICYmIGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnQG5ncngvZGF0YTogb3B0aW9ucy5odHRwUGFyYW1zIHdpbGwgYmUgbWVyZ2VkIHdpdGggcXVlcnlQYXJhbXMgd2hlbiBib3RoIGFyZSBhcmUgcHJvdmlkZWQgdG8gZ2V0V2l0aFF1ZXJ5KCkuIEluIHRoZSBldmVudCBvZiBhIGNvbmZsaWN0IEh0dHBPcHRpb25zLmh0dHBQYXJhbXMgd2lsbCBvdmVycmlkZSBxdWVyeVBhcmFtc2AuIFRoZSBxdWVyeVBhcmFtcyBwYXJhbWV0ZXIgb2YgZ2V0V2l0aFF1ZXJ5KCkgd2lsbCBiZSByZW1vdmVkIGluIG5leHQgbWFqb3IgcmVsZWFzZS4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGhlYWRlcnM6IGVudGl0eUFjdGlvbkh0dHBDbGllbnRPcHRpb25zPy5oZWFkZXJzID8/IG9wdGlvbnM/LmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczogZW50aXR5QWN0aW9uSHR0cENsaWVudE9wdGlvbnM/LnBhcmFtcyA/PyBvcHRpb25zPy5wYXJhbXMsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHJlcTogUmVxdWVzdERhdGEgPSB7XG4gICAgICBtZXRob2QsXG4gICAgICB1cmwsXG4gICAgICBkYXRhLFxuICAgICAgb3B0aW9uczogbWVyZ2VkT3B0aW9ucyxcbiAgICB9O1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXJyb3IocmVxKShkYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0JDogT2JzZXJ2YWJsZTxBcnJheUJ1ZmZlcj47XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLmRlbGV0ZSh1cmwsIG1lcmdlZE9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5zYXZlRGVsYXkpIHtcbiAgICAgICAgICByZXN1bHQkID0gcmVzdWx0JC5waXBlKGRlbGF5KHRoaXMuc2F2ZURlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdHRVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAuZ2V0KHVybCwgbWVyZ2VkT3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmdldERlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLmdldERlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdQT1NUJzoge1xuICAgICAgICByZXN1bHQkID0gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCBtZXJnZWRPcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuc2F2ZURlbGF5KSB7XG4gICAgICAgICAgcmVzdWx0JCA9IHJlc3VsdCQucGlwZShkZWxheSh0aGlzLnNhdmVEZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgLy8gTi5CLjogSXQgbXVzdCByZXR1cm4gYW4gVXBkYXRlPFQ+XG4gICAgICBjYXNlICdQVVQnOiB7XG4gICAgICAgIHJlc3VsdCQgPSB0aGlzLmh0dHAucHV0KHVybCwgZGF0YSwgbWVyZ2VkT3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLnNhdmVEZWxheSkge1xuICAgICAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUoZGVsYXkodGhpcy5zYXZlRGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgSFRUUCBtZXRob2QsICcgKyBtZXRob2QpO1xuICAgICAgICByZXN1bHQkID0gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIHJlc3VsdCQgPSByZXN1bHQkLnBpcGUodGltZW91dCh0aGlzLnRpbWVvdXQgKyB0aGlzLnNhdmVEZWxheSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0JC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcihyZXEpKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yKHJlcURhdGE6IFJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIChlcnI6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgb2sgPSB0aGlzLmhhbmRsZURlbGV0ZTQwNChlcnIsIHJlcURhdGEpO1xuICAgICAgaWYgKG9rKSB7XG4gICAgICAgIHJldHVybiBvaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IERhdGFTZXJ2aWNlRXJyb3IoZXJyLCByZXFEYXRhKTtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEZWxldGU0MDQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXFEYXRhOiBSZXF1ZXN0RGF0YSkge1xuICAgIGlmIChcbiAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDA0ICYmXG4gICAgICByZXFEYXRhLm1ldGhvZCA9PT0gJ0RFTEVURScgJiZcbiAgICAgIHRoaXMuZGVsZXRlNDA0T0tcbiAgICApIHtcbiAgICAgIHJldHVybiBvZih7fSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBiYXNpYywgZ2VuZXJpYyBlbnRpdHkgZGF0YSBzZXJ2aWNlXG4gKiBzdWl0YWJsZSBmb3IgcGVyc2lzdGVuY2Ugb2YgbW9zdCBlbnRpdGllcy5cbiAqIEFzc3VtZXMgYSBjb21tb24gUkVTVC15IHdlYiBBUElcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHREYXRhU2VydmljZUZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcm90ZWN0ZWQgaHR0cFVybEdlbmVyYXRvcjogSHR0cFVybEdlbmVyYXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgY29uZmlnPzogRGVmYXVsdERhdGFTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBodHRwVXJsR2VuZXJhdG9yLnJlZ2lzdGVySHR0cFJlc291cmNlVXJscyhjb25maWcuZW50aXR5SHR0cFJlc291cmNlVXJscyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCB7RW50aXR5Q29sbGVjdGlvbkRhdGFTZXJ2aWNlfSBmb3IgdGhlIGdpdmVuIGVudGl0eSB0eXBlXG4gICAqIEBwYXJhbSBlbnRpdHlOYW1lIHtzdHJpbmd9IE5hbWUgb2YgdGhlIGVudGl0eSB0eXBlIGZvciB0aGlzIGRhdGEgc2VydmljZVxuICAgKi9cbiAgY3JlYXRlPFQ+KGVudGl0eU5hbWU6IHN0cmluZyk6IEVudGl0eUNvbGxlY3Rpb25EYXRhU2VydmljZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBEZWZhdWx0RGF0YVNlcnZpY2U8VD4oXG4gICAgICBlbnRpdHlOYW1lLFxuICAgICAgdGhpcy5odHRwLFxuICAgICAgdGhpcy5odHRwVXJsR2VuZXJhdG9yLFxuICAgICAgdGhpcy5jb25maWdcbiAgICApO1xuICB9XG59XG4iXX0=