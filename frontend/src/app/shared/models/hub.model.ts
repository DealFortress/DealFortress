import { IHttpConnectionOptions } from "@microsoft/signalr";

export type Hub = {
    hubName: string,
    url: string,
    options?: IHttpConnectionOptions | undefined;
}