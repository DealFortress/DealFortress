import { Conversation } from "@app/shared/models/conversation/conversation.model";
import { User } from "@app/shared/models/user/user.model";

export class ConversationsService {

    static getLastUnreadMessage(conversation: Conversation, loggedInUser : User) {
        return conversation.messages
            .filter(message => message.senderId != loggedInUser.id)
            .sort((a, b ) => a.createdAt.valueOf() - b.createdAt.valueOf())
            .slice(-1)[0];
    }
}