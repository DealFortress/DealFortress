import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { User } from '@app/shared/models/user/user.model';
import { Store } from '@ngrx/store';
import { MessageNotification } from '@app/shared/models/message-notification.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '@app/shared/models/message/message.model';
import { formatDate } from '@angular/common';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { ReturnStatement } from '@angular/compiler';
import { convertMinutesToClosestTimeValue } from '@app/shared/helper-functions/helper-functions';


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
      return conversations.map((conversation) => {
        const userLastReadMessage = this.getLoggedInUserLastReadMessage(this.loggedInUser, conversation);
        const lastReceivedMessage = this.getLastReceivedMessage(conversation, this.loggedInUser);
        
        if (userLastReadMessage&& userLastReadMessage.createdAt.valueOf() < lastReceivedMessage.createdAt.valueOf()) {
          return this.createNotification(lastReceivedMessage, conversation)
        }
        return undefined
      }).filter((item): item is MessageNotification => !!item);
    }))
  }

  ngOnChanges(changes: SimpleChanges): void {

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

  getLoggedInUserLastReadMessage(loggedInUser : User, conversation: Conversation) {
    if (conversation.buyerId == loggedInUser.id) {
        return conversation.messages.find(message => message.id == conversation.buyerLastReadMessageId);
    } else if (conversation.sellerId == loggedInUser.id) {
        return conversation.messages.find(message => message.id == conversation.sellerLastReadMessageId);
    }
    return null;
  }

  getLastReceivedMessage(conversation : Conversation, loggedInUser : User) {
    return conversation.messages
                .filter(message => message.senderId != loggedInUser.id)
                .slice(-1)[0];
  }
  getSender(senderId : number) {
    return this.store.select(getUserById(senderId));
  }

  getMinutesSinceCreation(time : Date) {
    return convertMinutesToClosestTimeValue(time);
  }
  getDateinString(createdAt : Date) {
    return formatDate(createdAt,'yyyy-MM-dd','en-US')
  }

  getNotificationTextPreview(text : string) {
    if (text.length > 30) {
      return text.slice(0, 30) + '...';
    }
    return text;
  }

}

  
