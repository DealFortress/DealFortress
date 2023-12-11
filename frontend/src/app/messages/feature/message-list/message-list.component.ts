import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessagesApiService } from '@app/messages/data-access/service/messages-api.service';
import { connectToMessageHubRequest } from '@app/messages/data-access/store/messages.actions';
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

  constructor(messagesApiService: MessagesApiService) {
    // messagesApiService.getAll()
  }

  ngOnInit(): void {
  }

}

