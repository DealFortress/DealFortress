import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getConversations } from '@app/conversations/data-access/store/conversations.selectors';

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
  

  constructor(private store: Store, private route: ActivatedRoute, private Router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const currentConversation = paramMap.get('id')
      if (currentConversation) {
      this.selectedConversationId = +currentConversation;
    }
    })
  }


}
