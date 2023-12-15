import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
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
export class ConversationDetailComponent implements OnChanges{
  @Input({required: true}) conversation!: Conversation;
  @Output() unselectConversation$ = new EventEmitter();
  public user$ = this.store.select(getUser);
  public contact$ = this.store.select(getCurrentlyShownUser);
  

  constructor( private formBuilder: FormBuilder, private store: Store) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.user$.subscribe(user => {
      this.messageFormGroup.patchValue({senderId: user?.id})

      const contactId = this.conversation.userOneId == user?.id ? this.conversation.userTwoId : this.conversation.userOneId;

      this.store.dispatch(loadUserByIdRequest({ id: contactId }))
    })
  }
  
  ngOnInit(): void {
    this.messageFormGroup.patchValue({ conversationId: this.conversation.id })
  }
  

  onMessageSubmit() {
    const messageRequest = this.messageFormGroup.value as MessageRequest;
    this.store.dispatch(postMessageRequest({ request: messageRequest }));
  }

  unselectConversation() {
    this.unselectConversation$.emit();
  }
  
  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
    conversationId: -1
  })
}
