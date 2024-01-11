import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { postConversationRequest, postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversationById, getConversationByNoticeId } from '@app/conversations/data-access/store/conversations.selectors';
import { ConversationRequest } from '@app/shared/models/conversation/conversation-request.model';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { MessageRequest } from '@app/shared/models/message/message-request';
import { Notice } from '@app/shared/models/notice/notice.model';
import { User } from '@app/shared/models/user/user.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getLoggedInUser } from '@app/users/data-access/store/users.selectors';
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

  }


  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
    conversationId: -1
  })


   onConversationSubmit() {
    const conversationFormGroup = this.formBuilder.group({
      noticeId: this.notice.id,
      name: this.notice.title,
      buyerId: this.sender.id,
      SellerId: this.recipient.id,
      messageRequest: this.messageFormGroup
    })

    const conversationRequest = conversationFormGroup.value as ConversationRequest;
    this.store.dispatch(postConversationRequest({ request: conversationRequest }));
  }

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }
}
