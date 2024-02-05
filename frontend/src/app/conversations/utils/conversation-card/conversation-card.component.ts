import { Component, Input, OnInit } from '@angular/core';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { User } from '@app/shared/models/user/user.model';
import { getLoggedInUser, getUserById } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConversationsService } from '../services/conversation.services';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrl: './conversation-card.component.css'
})
export class ConversationCardComponent implements OnInit {
 @Input({required: true}) conversation! : Conversation;
 recipient$? : Observable<User | undefined>;
 loggedInUser$ = this.store.select(getLoggedInUser)
 hasUnreadMessage? : boolean;

 constructor(private store: Store) {}

  ngOnInit(): void {
    this.loggedInUser$.subscribe(loggedInUser => {
      if (loggedInUser) {
        let recipientId = loggedInUser.id == this.conversation.buyerId ? this.conversation.sellerId : this.conversation.buyerId;
        this.recipient$ = this.store.select(getUserById(recipientId));
        this.hasUnreadMessage = this.setHasUnreadMessage(loggedInUser);
      }
    }) 
  }

 

  getLatestMessagePreview(conversation: Conversation) {
    const latestMessageText = conversation.messages[conversation.messages.length - 1].text;

    if (latestMessageText.length <= 30) {
      return latestMessageText;
    }
    
    return `${conversation.messages[conversation.messages.length - 1].text.slice(0, 30)}...`;
  }

  setHasUnreadMessage(loggedInUser : User) {
    if (loggedInUser.id == this.conversation.buyerId) {
      return this.conversation.buyerLastReadMessageId != ConversationsService.getLastUnreadMessage(this.conversation, loggedInUser).id;
    } else if (loggedInUser.id == this.conversation.sellerId) {
      return this.conversation.sellerLastReadMessageId != ConversationsService.getLastUnreadMessage(this.conversation, loggedInUser).id;
    } else {
      return false;
    }
  }
}
