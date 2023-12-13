import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getMessages } from '@app/messages/data-access/store/messages.selectors';
import { Message } from '@app/shared/models/message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent {
  public messages$?: Observable<Message[] | undefined>;

  constructor(private store: Store, private formBuilder: FormBuilder) {
  }
  
  ngOnInit(): void {
    this.messages$ = this.store.select(getMessages);
  }

  onMessageSubmit() {

  }
  
  MessageFormGroup = this.formBuilder.group({
    text: '',
    // recipientId: 
  })
}
