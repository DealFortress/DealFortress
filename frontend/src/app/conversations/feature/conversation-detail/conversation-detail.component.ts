import { Component, ElementRef,  Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { patchLastReadMessageRequest } from '@app/conversations/data-access/store/conversations.actions';
import { getConversationById } from '@app/conversations/data-access/store/conversations.selectors';
import { getNoticeById } from '@app/notices/data-access/store/notices.selectors';
import { Conversation } from '@app/shared/models/conversation/conversation.model';
import { PatchLastReadMessageRequest } from '@app/shared/models/conversation/patch-last-read-message-request.model';
import { Notice } from '@app/shared/models/notice/notice.model';
import { User } from '@app/shared/models/user/user.model';
import {  getLoggedInUser, getUserById } from '@app/users/data-access/store/users.selectors';
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
  public loggedInUserLastReadMessageId? : number; 
  public recipientLastReadMessageId? : number;
  @ViewChild("scrollTarget", { static: false }) scrollTarget?: ElementRef;
  

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    this.conversation$ =  this.store.select(getConversationById(this.conversationId));
    
    this.conversation$.subscribe(conversation => {
      if (conversation) {
        setTimeout(() => this.scrollToLatestMessage(), 1)

        this.notice$ = this.store.select(getNoticeById(conversation.noticeId))
        
        this.loggedInUser$.subscribe(loggedInUser => {
          if (loggedInUser) {
            this.setUsersLastReadMessageId(loggedInUser, conversation);
            this.setRecipient(loggedInUser, conversation);
            this.patchLastReadMessage(loggedInUser, conversation)
          }
        })
      }
    })
  }

  navigateBack() {
    this.router.navigate(['conversations/'])
  }


  scrollToLatestMessage() {
    this.scrollTarget?.nativeElement.scrollIntoView({
      block: "start"
    });
  }

  setRecipient(loggedInUser : User, conversation: Conversation) {
    let recipientId = loggedInUser.id == conversation.buyerId ? conversation.sellerId : conversation.buyerId;

    
    this.recipient$ = this.store.select(getUserById(recipientId));
    // this.store.select(getUserById(recipientId)).subscribe(recipient => {
    //   if (recipient == undefined) {
    //     this.store.dispatch(loadUserByIdRequest({id :recipientId}));
    //   }
    //   this.recipient$ = this.store.select(getUserById(recipientId)); 
    // })
  }

  patchLastReadMessage(loggedInUser : User, conversation: Conversation) {

    const lastReadMessage = conversation.messages
      .filter(message => message.senderId != loggedInUser.id)
      .sort((a, b ) => a.createdAt.valueOf() - b.createdAt.valueOf())
      .slice(-1)[0];

    if (lastReadMessage.id != this.loggedInUserLastReadMessageId) {
        const patchRequest : PatchLastReadMessageRequest = {
          conversationId: conversation.id,
          readerId: loggedInUser.id,
          messageId: lastReadMessage.id
        }
        this.store.dispatch(patchLastReadMessageRequest({request: patchRequest}))
      }
  }

  setUsersLastReadMessageId(loggedInUser : User, conversation: Conversation) {
    if (conversation.buyerId == loggedInUser.id) {
      this.loggedInUserLastReadMessageId = conversation.buyerLastReadMessageId;
      this.recipientLastReadMessageId = conversation.sellerLastReadMessageId;
    } else if (conversation.sellerId == loggedInUser.id) {
      this.loggedInUserLastReadMessageId = conversation.sellerLastReadMessageId;
      this.recipientLastReadMessageId = conversation.buyerLastReadMessageId;
    }
  }



}
