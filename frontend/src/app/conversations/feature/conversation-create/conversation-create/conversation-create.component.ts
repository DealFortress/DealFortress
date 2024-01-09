import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { MessageRequest } from '@app/shared/models/message/message-request';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-conversation-create',
  templateUrl: './conversation-create.component.html',
  styleUrl: './conversation-create.component.css'
})
export class ConversationCreateComponent implements OnChanges {
  @Input() conversationId?: number;
  @Input({required: true}) senderId!: number;
  @Input({required: true}) recipientId! : number;



  constructor( private formBuilder: FormBuilder, private store : Store) {}

  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
    conversationId: -1
  })

  ngOnChanges(changes: SimpleChanges): void {

      this.messageFormGroup.patchValue({senderId: this.senderId})     

      this.store.dispatch(loadUserByIdRequest({ id: this.recipientId }))

  }
  
  ngOnInit(): void {
    // if conversation is not provided exist it needs to be created in the backend

    if(this.conversationId) {
      this.messageFormGroup.patchValue({ conversationId: this.conversationId })
    }
  }
  

  onMessageSubmit() {    
    const messageRequest = this.messageFormGroup.value as MessageRequest;
    this.store.dispatch(postMessageRequest({ request: messageRequest }));
  }
}
