import { Component, Input, OnChanges} from '@angular/core';
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
export class ConversationCardComponent implements OnChanges {
 @Input({required: true}) conversation! : Conversation;
 @Input({required: true}) loggedInUser! : User;
 recipient$? : Observable<User | undefined>;
 loggedInUser$ = this.store.select(getLoggedInUser)
 hasUnreadMessage : boolean = false;

 constructor(private store: Store) {}
  ngOnChanges(): void {
    const recipientId = this.loggedInUser.id == this.conversation.buyerId ? this.conversation.sellerId : this.conversation.buyerId;
    this.recipient$ = this.store.select(getUserById(recipientId));
    this.hasUnreadMessage = this.setHasUnreadMessage(this.conversation, this.loggedInUser);
  }

  setHasUnreadMessage(conversation: Conversation, loggedInUser : User) {
    const lastUnreadMessage = ConversationsService.getLastUnreadMessage(conversation, loggedInUser)?.id;
    if(lastUnreadMessage == undefined) {
      return false;
    } else if (loggedInUser.id == conversation.buyerId ) {
      return conversation.buyerLastReadMessageId != lastUnreadMessage;
    } else if (loggedInUser.id == conversation.sellerId) {
      return conversation.sellerLastReadMessageId != lastUnreadMessage;
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
