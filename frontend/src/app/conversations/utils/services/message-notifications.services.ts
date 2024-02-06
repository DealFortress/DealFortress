import { formatDate } from "@angular/common"
import { Injectable } from "@angular/core";
import { Conversation } from "@app/shared/models/conversation/conversation.model"
import { Message } from "@app/shared/models/message/message.model"
import { MessageNotification } from "@app/shared/models/message-notification.model";
import { getLoggedInUser, getUserById } from "@app/users/data-access/store/users.selectors"
import { Store } from "@ngrx/store";
import { User } from "@app/shared/models/user/user.model";

@Injectable()
export class MessageNotificationsServices {
    public notifications : MessageNotification[] = [];
    private loggedInUser = this.store.select(getLoggedInUser);

    constructor(private store: Store) {}


    getLoggedInUserLastReadMessageId(loggedInUser : User, conversation: Conversation) {
        if (conversation.buyerId == loggedInUser.id) {
          return conversation.buyerLastReadMessageId;
        } else if (conversation.sellerId == loggedInUser.id) {
          return conversation.sellerLastReadMessageId;
        }
        return null;
      }

    setNotifications(conversations : Conversation[]) {
        this.loggedInUser.subscribe(loggedInUser => {
            if (loggedInUser == undefined) {
                return;
            }

            conversations.forEach(conversation => {
             const userLastReadMessageId = this.getLoggedInUserLastReadMessageId(loggedInUser, conversation);
             const lastReadMessage = conversation.messages.find(message => message.id == userLastReadMessageId);
   
             const lastReceivedMessage = conversation.messages
               .filter(message => message.senderId != loggedInUser.id)
               .slice(-1)[0];
             
               
               if (lastReadMessage && lastReadMessage.createdAt.valueOf() < lastReceivedMessage.createdAt.valueOf() ) {
               this.createNotification(lastReceivedMessage, conversation)
             } 
             // else if (lastReadMessage?.id == lastReceivedMessage.id ) {
   
             // }
           })
        })
        }
      }

    createNotification(lastReceivedMessage: Message, conversation: Conversation) {
        this.store.select(getUserById(lastReceivedMessage.senderId)).subscribe(sender => {
            if (sender) {
                const notification : MessageNotification = {
                conversationId: conversation.id,
                senderName: sender.username,
                text: lastReceivedMessage.text,
                messageCreatedAt: formatDate(lastReceivedMessage.createdAt,'yyyy-MM-dd','en-US')
                }
                this.notifications.push(notification);
            }
        })
    }
}