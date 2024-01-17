import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { postConversationRequest } from '@app/conversations/data-access/store/conversations.actions';
import { ConversationRequest } from '@app/shared/models/conversation/conversation-request.model';
import { Notice } from '@app/shared/models/notice/notice.model';
import { User } from '@app/shared/models/user/user.model';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-conversation-create',
  templateUrl: './conversation-create.component.html',
  styleUrl: './conversation-create.component.css'
})
export class ConversationCreateComponent implements OnInit{
  @Output() toggleMessagePopup$ = new EventEmitter();
  @Input({required: true}) notice!: Notice;
  @Input({required: true}) sender!: User;
  @Input({required: true}) recipient! : User;


  constructor( private formBuilder: FormBuilder, private store : Store) {}

  ngOnInit(): void {
    this.messageFormGroup.controls.text
      .patchValue(`\n Hey ${this.recipient.username}, 
      \n I have a question about '${this.notice.title}' 
      \n \n Kind regards,
      \n ${this.sender.username}`)
    
      this.messageFormGroup.controls.senderId.patchValue(this.sender.id)

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
  }

  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
  })



   onConversationSubmit() {
    const conversationFormGroup = this.formBuilder.group({
      noticeId: this.notice.id,
      name: this.notice.title,
      buyerId: this.sender.id,
      sellerId: this.recipient.id,
      // messageRequests: this.formBuilder.array([
      //   this.messageFormGroup
      // ])
    })

    const conversationRequest = conversationFormGroup.value as ConversationRequest;
    console.log(conversationRequest);
    this.store.dispatch(postConversationRequest({ request: conversationRequest }));
  }

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
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
}
