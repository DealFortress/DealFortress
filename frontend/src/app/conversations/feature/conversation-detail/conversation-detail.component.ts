import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { getConversationById } from '@app/conversations/data-access/store/conversations.selectors';
import { getNoticeById, getUserIdByNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { Notice } from '@app/shared/models/notice/notice.model';
import { User } from '@app/shared/models/user/user.model';
import {  getLoggedInUser, getUserById } from '@app/users/data-access/store/users.selectors';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrl: './conversation-detail.component.css'
})
export class ConversationDetailComponent implements OnChanges, OnInit {
  @Input({required: true}) conversationId!: number;
  public loggedInUser$ = this.store.select(getLoggedInUser);
  public recipient$? : Observable<User | undefined>;
  public conversation$? : Observable<Conversation | undefined>;
  public notice$? :  Observable<Notice | undefined>;
  @ViewChild("scrollTarget", { static: false }) scrollTarget?: ElementRef;
  

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    setTimeout(() => this.scrollToLatestMessage(), 1)
    
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    this.conversation$ =  this.store.select(getConversationById(this.conversationId));
    
    this.conversation$.subscribe(conversation => {
      if (conversation) {
        this.notice$ = this.store.select(getNoticeById(conversation.noticeId))
        
        this.loggedInUser$.subscribe(loggedInUser => {
          if (loggedInUser) {
            let recipientId = loggedInUser.id == conversation.buyerId ? conversation.sellerId : conversation.buyerId;
            this.recipient$ = this.store.select(getUserById(recipientId));
          }
        }) 
      }
    })
  }

  navigateBack() {
    this.router.navigate(['conversations/'])
  }

  navigateToNotice(notice : Notice) {
        this.router.navigate(['notices/', notice.id])
  }

  scrollToLatestMessage() {
    this.scrollTarget?.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
