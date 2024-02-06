import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { User } from '@app/shared/models/user/user.model';
import { getLoggedInUser, getUserById } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConversationsService } from '../services/conversation.services';
import { getConversationById } from '@app/conversations/data-access/store/conversations.selectors';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrl: './conversation-card.component.css'
})
export class ConversationCardComponent implements OnChanges {
 @Input({required: true}) conversation! : Conversation;
 @Input({required: true}) loggedInUser! : User;
 recipient$? : Observable<User | undefined>;
 loggedInUser$ = this.store.select(getLoggedInUser)
 hasUnreadMessage : boolean = false;

 constructor(private store: Store) {}
  ngOnChanges(changes: SimpleChanges): void {
    let recipientId = this.loggedInUser.id == this.conversation.buyerId ? this.conversation.sellerId : this.conversation.buyerId;
    this.recipient$ = this.store.select(getUserById(recipientId));
    this.hasUnreadMessage = this.setHasUnreadMessage(this.conversation, this.loggedInUser);
  }

  setHasUnreadMessage(conversation: Conversation, loggedInUser : User) {
    console.log(conversation);
    if (loggedInUser.id == conversation.buyerId) {
      return conversation.buyerLastReadMessageId != ConversationsService.getLastUnreadMessage(conversation, loggedInUser).id;
    } else if (loggedInUser.id == conversation.sellerId) {
      return conversation.sellerLastReadMessageId != ConversationsService.getLastUnreadMessage(conversation, loggedInUser).id;
    } else {
      return false;
    }
  }

  getLatestMessagePreview(conversation: Conversation) {
    const latestMessageText = conversation.messages[conversation.messages.length - 1].text;

    if (latestMessageText.length <= 30) {
      return latestMessageText;
    }
    
    return `${conversation.messages[conversation.messages.length - 1].text.slice(0, 30)}...`;
  }
}
