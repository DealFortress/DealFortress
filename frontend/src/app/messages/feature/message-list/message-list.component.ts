import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getMessages } from '@app/messages/data-access/store/messages.selectors';
import { Message } from '@app/shared/models/message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  public messages$?: Observable<Message[] | undefined>;

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {
    this.messages$ = this.store.select(getMessages);
  }

}

