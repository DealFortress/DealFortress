import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { postConversationRequest, postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversationByNoticeId } from '@app/conversations/data-access/store/conversations.selectors';
import { ConversationRequest } from '@app/shared/models/conversation/conversation-request.model';
import { MessageRequest } from '@app/shared/models/message/message-request';
import { Notice } from '@app/shared/models/notice/notice.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-messages-create',
  templateUrl: './messages-create.component.html',
  styleUrl: './messages-create.component.css'
})
export class MessagesCreateComponent{
  @Input({required: true}) conversationId!: number;
  @Input({required: true}) senderId!: number;
  @Input({required: true}) recipientId! : number;
  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
    conversationId: -1
  })

  constructor( private formBuilder: FormBuilder, private store : Store) {}


  onMessageSubmit() {   
    this.messageFormGroup.patchValue({senderId : this.senderId});
    this.messageFormGroup.patchValue({conversationId : this.conversationId});

    const messageRequest = this.messageFormGroup.value as MessageRequest;
    this.store.dispatch(postMessageRequest({ request: messageRequest }));
  }
}
