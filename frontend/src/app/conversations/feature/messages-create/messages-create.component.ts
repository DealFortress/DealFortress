import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { postMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { MessageRequest } from '@app/shared/models/message/message-request.model';
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
    text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    senderId: [-1, [Validators.required]],
    conversationId: [-1, [Validators.required]]
  })

  constructor( private formBuilder: FormBuilder, private store : Store) {}


  onMessageSubmit() {   
    this.messageFormGroup.patchValue({senderId : this.senderId});
    this.messageFormGroup.patchValue({conversationId : this.conversationId});

    const messageRequest = this.messageFormGroup.value as MessageRequest;
    this.store.dispatch(postMessageRequest({ request: messageRequest }));
  }

}
