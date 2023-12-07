import { Component } from '@angular/core';
import { MessagesService } from '@app/messages/data-access/service/messages.service';
import { connectToMessageHub } from '@app/messages/data-access/store/messages.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  public messages = this.store.select(connectToMessageHub);

  constructor(private store: Store) {

  }
}
