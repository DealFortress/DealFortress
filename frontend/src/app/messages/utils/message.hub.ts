import { Hub } from "@app/shared/models/hub.model";
import { environment } from "environments/environment.production";

export const messageHub: Hub = {
    hubName: 'Messages',
    url: `${environment.hubServerUrl}/messages-hub`
}