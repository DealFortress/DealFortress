import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { postConversationRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversationByNoticeId } from '@app/conversations/data-access/store/conversations.selectors';
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


  constructor( private formBuilder: FormBuilder, private store : Store, private router: Router) {}

  ngOnInit(): void {
    this.messageFormGroup.controls.text
      .patchValue(`\r\n Hey ${this.recipient.username}, 
      \r\n I have a question about '${this.notice.title}' 
      \r\n \r\n Kind regards,
      \r\n ${this.sender.username}`)
    
      this.messageFormGroup.controls.senderId.patchValue(this.sender.id)
  }

  messageFormGroup = this.formBuilder.group({
    text: '',
    senderId: -1,
  })

  onConversationSubmit() {
    const conversationFormGroup = this.formBuilder.group({
      noticeId: [this.notice.id, [Validators.required]],
      name: [this.notice.title, [Validators.required]],
      buyerId: [this.sender.id, [Validators.required]],
      sellerId: [this.recipient.id, [Validators.required]],
      messageRequests: [this.formBuilder.array([
        this.messageFormGroup
      ], [Validators.required, Validators.minLength(1), Validators.maxLength(1)])]
    })

    const conversationRequest = conversationFormGroup.value as ConversationRequest;
    this.store.dispatch(postConversationRequest({ request: conversationRequest }));

    this.redirectToConversation()
  }

  getErrorMessage(formControl : AbstractControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value';
    }

    return formControl.hasError('minlength') ? `this field must be at least ${formControl.errors?.['minlength'].requiredLength} characters` : '';
  }

  redirectToConversation() {
    this.store.select(getConversationByNoticeId(this.notice.id)).subscribe(createdConversation => {
      if (createdConversation == undefined) {
        this.router.navigate(['messages/']);
      } else if (createdConversation) {
        this.router.navigate(['messages/', createdConversation.id]);
      }
    })
  }
}
