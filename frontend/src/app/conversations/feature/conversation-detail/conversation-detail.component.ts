import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { getConversationById } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getNoticeOwner, getLoggedInUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent implements OnInit {
  @Input({required: true}) conversationId!: number;
  @Output() unselectConversation$ = new EventEmitter();
  public user$ = this.store.select(getLoggedInUser);
  public recipient$ = this.store.select(getNoticeOwner);
  public conversation$? : Observable<Conversation | undefined>;

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {
    this.conversation$ =  this.store.select(getConversationById(this.conversationId));
    
    // this.store.dispatch(loadUserByIdRequest({id: notice.userId})) 
    this.recipient$.subscribe(recipient => {if (recipient) { console.log(recipient)}})
  }

  unselectConversation() {
    this.unselectConversation$.emit();
  }
  
}
