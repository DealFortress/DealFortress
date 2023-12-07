import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { connectToMessageHubRequest } from '@app/messages/data-access/store/messages.actions';
import { connectToMessageHub } from '@app/messages/data-access/store/messages.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnChanges{
  public messages = this.store.select(connectToMessageHub);

  constructor(private store: Store) {
    store.dispatch(connectToMessageHubRequest())
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.messages.subscribe(data => {
      if (data) console.log(data);
    });
  }

  ngOnInit(): void {
      
  }
}
