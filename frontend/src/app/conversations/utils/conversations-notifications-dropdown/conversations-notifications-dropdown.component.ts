import { Component, Input, OnInit } from '@angular/core';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message.model';
import { Notification } from '@app/shared/models/notification.model';
import { User } from '@app/shared/models/user/user.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import {formatDate} from '@angular/common';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';

@Component({
  selector: 'app-conversations-notifications-dropdown',
  templateUrl: './conversations-notifications-dropdown.component.html',
  styleUrl: './conversations-notifications-dropdown.component.css'
})
export class ConversationsNotificationsDropdownComponent implements OnInit {
  conversations = this.store.select(getConversations);
  notifications : Notification[] = []  ;
  loggedInUserLastReadMessageId? : number; 
  @Input({required: true}) loggedInUser! : User;

  constructor(private store : Store) {}

  ngOnInit(): void {
    this.setNotifications()
    console.log(this.notifications);
  }

  setNotifications() {
    this.conversations.subscribe(conversations => {    
      if (conversations) {
         conversations.forEach(conversation => {
          const userLastReadMessageId = this.getLoggedInUserLastReadMessageId(this.loggedInUser!, conversation);
          const lastReadMessage = conversation.messages.find(message => message.id == userLastReadMessageId);

          const lastReceivedMessage = conversation.messages
            .filter(message => message.senderId != this.loggedInUser!.id)
            .slice(-1)[0];
          
            
            if (lastReadMessage && lastReadMessage.createdAt.valueOf() < lastReceivedMessage.createdAt.valueOf() ) {
            this.createNotification(lastReceivedMessage, conversation)
          }
        })
      }
    })
  }

  createNotification(lastReceivedMessage: Message, conversation: Conversation) {
    this.store.select(getUserById(lastReceivedMessage.senderId)).subscribe(sender => {
      if (sender) {
        this.notifications.push({
          conversationId: conversation.id,
          senderName: sender.username,
          text: lastReceivedMessage.text,
          messageCreatedAt: formatDate(lastReceivedMessage.createdAt,'yyyy-MM-dd','en-US')
        } as Notification)
        console.log(this.notifications)
      }
    })
  }

  getLoggedInUserLastReadMessageId(loggedInUser : User, conversation: Conversation) {
    if (conversation.buyerId == loggedInUser.id) {
      return conversation.buyerLastReadMessageId;
    } else if (conversation.sellerId == loggedInUser.id) {
      return conversation.sellerLastReadMessageId;
    }
    return null;
  }

  
}
