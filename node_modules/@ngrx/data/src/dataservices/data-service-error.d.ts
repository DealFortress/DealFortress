import { EntityAction } from '../actions/entity-action';
import { RequestData } from './interfaces';
/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
export declare class DataServiceError extends Error {
    error: any;
    requestData: RequestData | null;
    constructor(error: any, requestData: RequestData | null);
}
/** Payload for an EntityAction data service error such as QUERY_ALL_ERROR */
export interface EntityActionDataServiceError {
    error: DataServiceError;
    originalAction: EntityAction;
}
