import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Message } from '@app/shared/models/message/message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.css'
})
export class ConversationListComponent {
  public conversations$?: Observable<Conversation[] | undefined>;
  public selectedConversation?: Conversation;

  constructor(private store: Store, private formBuilder: FormBuilder) {
  }
  
  ngOnInit(): void {
    this.conversations$ = this.store.select(getConversations);
    this.conversations$.subscribe(conversations => { if (conversations)  console.log(conversations)})
  }

  getContactName(conversation : Conversation) {
    // get curren user id filter to goet the other person id and then grab the user name by the id
  }

  getLatestMessagePreview(conversation: Conversation) {
    const latestMessageText = conversation.messages[conversation.messages.length - 1].text;

    if (latestMessageText.length <= 30) {
      return latestMessageText;
    }
    
    return `${conversation.messages[conversation.messages.length - 1].text.slice(0, 30)}...`;
  }
}
