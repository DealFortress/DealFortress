import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';
import { ConversationsService } from '@app/conversations/utils/services/conversation.services';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { User } from '@app/shared/models/user/user.model';
import { getLoggedInUser } from '@app/users/data-access/store/users.selectors';

import { Store } from '@ngrx/store';


@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.css'
})
export class ConversationListComponent implements OnInit{
  public conversations$ = this.store.select(getConversations);
  selectedConversationId? : number;
  router = this.Router;
  public loggedInUser$ = this.store.select(getLoggedInUser);

  constructor(private store: Store,  private Router: Router, private route : ActivatedRoute) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.get('id') == null ) {
        return;
      }

      this.selectedConversationId = +(paramMap.get('id'))!;
    })
  }
}
