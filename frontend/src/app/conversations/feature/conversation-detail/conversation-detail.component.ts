import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent {
  @Input({required: true}) conversation!: Conversation;

  constructor( private formBuilder: FormBuilder) {
  }
  
  ngOnInit(): void {
  
  }

  onMessageSubmit() {

  }
  
  MessageFormGroup = this.formBuilder.group({
    text: '',
    // recipientId: 
  })
}
