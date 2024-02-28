import { Component, Input,  OnInit } from '@angular/core';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { User } from '@app/shared/models/user/user.model';
import { Store } from '@ngrx/store';
import { MessageNotification } from '@app/shared/models/message-notification.model';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { Message } from '@app/shared/models/message/message.model';
import { Conversation } from '@app/shared/models/conversation/conversation.model';



@Component({
  selector: 'app-conversations-notifications-dropdown',
  templateUrl: './conversations-notifications-dropdown.component.html',
  styleUrl: './conversations-notifications-dropdown.component.css'
})
export class ConversationsNotificationsDropdownComponent implements OnInit {
  conversations = this.store.select(getConversations);
  loggedInUserLastReadMessageId? : number; 
  @Input({required: true}) loggedInUser! : User;
  notifications$! : Observable<MessageNotification []>;
  minutesSinceCreation: string = '';

  constructor(private store : Store) {}
  ngOnInit(): void {

    this.notifications$ = this.conversations.pipe(map(conversations => {
      if (conversations) {
        return conversations.map((conversation) => {
          const userLastReadMessage = this.getLoggedInUserLastReadMessage(this.loggedInUser, conversation);
          const lastReceivedMessage = this.getLastReceivedMessage(conversation, this.loggedInUser);
          
          if (userLastReadMessage && lastReceivedMessage && 
              userLastReadMessage.createdAt.valueOf() >= lastReceivedMessage?.createdAt.valueOf()) {
            return undefined
          } else if (lastReceivedMessage) {
            return this.createNotification(lastReceivedMessage, conversation)
          }
          return undefined
        }).filter((item): item is MessageNotification => !!item);
      }
      return [];
    }))
  }

  createNotification(lastReceivedMessage: Message, conversation: Conversation) {
    const notification : MessageNotification = {
            conversationId: conversation.id,
            senderId: lastReceivedMessage.senderId,
            text: lastReceivedMessage.text,
            messageCreatedAt: lastReceivedMessage.createdAt
            }
    return notification;  
  }

  getLoggedInUserLastReadMessage(loggedInUser : User, conversation: Conversation) : Message | undefined | null {
    if (conversation.buyerId == loggedInUser.id) {
        return conversation.messages.find(message => message.id == conversation.buyerLastReadMessageId);
    } else if (conversation.sellerId == loggedInUser.id) {
        return conversation.messages.find(message => message.id == conversation.sellerLastReadMessageId);
    }
    return null;
  }

  getLastReceivedMessage(conversation : Conversation, loggedInUser : User) : Message | undefined {
    return conversation.messages
                .filter(message => message.senderId != loggedInUser.id)
                .slice(-1)[0];
  }
  
  closeDropdown() {
    const element = document.activeElement;
    if (element &&  document.activeElement instanceof HTMLElement) {
      (element as HTMLElement).blur();
    }
  }

}

  
