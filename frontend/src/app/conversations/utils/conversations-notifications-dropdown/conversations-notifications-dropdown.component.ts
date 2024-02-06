import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message.model';
import { User } from '@app/shared/models/user/user.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import {formatDate} from '@angular/common';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { MessageNotificationsServices } from '../services/message-notifications.services';


@Component({
  selector: 'app-conversations-notifications-dropdown',
  templateUrl: './conversations-notifications-dropdown.component.html',
  styleUrl: './conversations-notifications-dropdown.component.css'
})
export class ConversationsNotificationsDropdownComponent implements OnChanges {
  conversations = this.store.select(getConversations);
  loggedInUserLastReadMessageId? : number; 
  @Input({required: true}) loggedInUser! : User;

  constructor(private store : Store, private messageNotificationsService: MessageNotificationsServices) {}

  ngOnChanges(changes: SimpleChanges): void {
  }


  }

  
}
