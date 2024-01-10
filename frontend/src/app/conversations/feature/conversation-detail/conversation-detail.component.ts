import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversationById, getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import { MessageRequest } from '@app/shared/models/message/message-request';
import { User } from '@app/shared/models/user/user.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getCurrentlyShownUser, getUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { signalrConnected } from 'ngrx-signalr-core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent implements OnInit {
  @Input({required: true}) conversationId!: number;
  @Output() unselectConversation$ = new EventEmitter();
  public user$ = this.store.select(getUser);
  public contact$ = this.store.select(getCurrentlyShownUser);
  public conversation$? : Observable<Conversation | undefined>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.conversation$ =  this.store.select(getConversationById(this.conversationId)); 
  }

  unselectConversation() {
    this.unselectConversation$.emit();
  }
  
}
