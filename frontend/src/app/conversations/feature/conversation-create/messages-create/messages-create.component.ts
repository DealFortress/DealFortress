import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
export class MessagesCreateComponent implements OnChanges, OnInit{
  @Input({required: true}) conversationId!: number;
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

    // if (this.notice && this.conversationId == undefined) {
    //   const conversation = this.store.select(getConversationByNoticeId(this.notice.id));
    //   conversation.subscribe(conversation => { 
    //     if (conversation) {
    //       this.conversationId = conversation.id;
    //       this.messageFormGroup.patchValue({ conversationId: conversation.id });
    //       return;
    //     }
    //   })
    // }
    this.messageFormGroup.patchValue({ conversationId: this.conversationId });
  }

  // onFormSubmit() {
  //  if ( this.conversationId == -1) {
  //   this.onConversationSubmit()
  //  }
  // }

  // onConversationSubmit() {

  //   const conversationFormGroup = this.formBuilder.group({
  //     noticeId: this.notice?.id,
  //     name: this.notice?.title,
  //     buyerId: this.senderId,
  //     SellerId: this.recipientId,
  //     messageRequest: this.messageFormGroup
  //   })

  //   const conversationRequest = conversationFormGroup.value as ConversationRequest;
  //   this.store.dispatch(postConversationRequest({ request: conversationRequest }));
  // }
  

  onMessageSubmit() {    
    const messageRequest = this.messageFormGroup.value as MessageRequest;
    this.store.dispatch(postMessageRequest({ request: messageRequest }));
  }
}
