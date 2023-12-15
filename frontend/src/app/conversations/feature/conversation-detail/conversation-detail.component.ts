import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import { User } from '@app/shared/models/user/user.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getCurrentlyShownUser, getUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent {
  @Input({required: true}) conversation!: Conversation;
  public user$ = this.store.select(getUser);
  public contact$ = this.store.select(getCurrentlyShownUser);
  

  constructor( private formBuilder: FormBuilder, private store: Store) {
  }
  
  ngOnInit(): void {
    let contactId: number;

    this.user$.subscribe(user => {
      if (this.conversation.userOneId == user?.id) {
        contactId = this.conversation.userTwoId;
      } else {
        contactId = this.conversation.userOneId;
      }

      this.store.dispatch(loadUserByIdRequest({ id: contactId }))
    })

  }

  onMessageSubmit() {

  }
  
  MessageFormGroup = this.formBuilder.group({
    text: '',
    // recipientId: 
  })
}
