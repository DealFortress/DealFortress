import { Hub } from "@app/shared/models/hub.model";
import { environment } from "environments/environment.production";

export const conversationHub: Hub = {
    hubName: 'Conversations',
    url: `${environment.hubServerUrl}/conversations-hub`
}