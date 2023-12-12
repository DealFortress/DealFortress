import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { connectToMessageHub } from '@app/messages/data-access/store/messages.selectors';
import { Message } from '@app/shared/models/message';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  public messages$?: Observable<Message[]>;

  constructor(private store: Store) {
    // this.messages$ = store.select(sel)
    // messagesApiService.getAll()
  }

  ngOnInit(): void {
  }

}

