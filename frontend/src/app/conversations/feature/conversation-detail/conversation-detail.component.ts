import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { getConversationById } from '@app/conversations/data-access/store/conversations.selectors';
import { getUserIdByNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { User } from '@app/shared/models/user/user.model';
import {  getLoggedInUser, getUserById } from '@app/users/data-access/store/users.selectors';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
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
  public loggedInUser$ = this.store.select(getLoggedInUser);
  public recipient$? : Observable<User | undefined>;
  public conversation$? : Observable<Conversation | undefined>;

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {


    this.conversation$ =  this.store.select(getConversationById(this.conversationId));
    
    this.conversation$.subscribe(conversation => {
      if (conversation) {
        this.loggedInUser$.subscribe(loggedInUser => {
          if (loggedInUser) {
            let recipientId = loggedInUser.id == conversation.buyerId ? conversation.sellerId : conversation.buyerId;
            this.recipient$ = this.store.select(getUserById(recipientId));
          }
        }) 
      }
    })
  }

  unselectConversation() {
    this.unselectConversation$.emit();
  }
  
}
