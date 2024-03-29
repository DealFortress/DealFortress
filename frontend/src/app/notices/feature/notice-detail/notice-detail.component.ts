import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getConversationByNoticeId } from '@app/conversations/data-access/store/conversations.selectors';
import { deleteNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById, getNoticesStatus } from '@app/notices/data-access/store/notices.selectors';
import { NoticesService } from '@app/notices/utils/services/notices.service';
import { Notice } from '@app/shared/models/notice/notice.model';
import { Product } from '@app/shared/models/product/product.model';
import { Status } from '@app/shared/models/state.model';
import { User } from '@app/shared/models/user/user.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getUserById, getLoggedInUser} from '@app/users/data-access/store/users.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.css']
})
export class NoticeDetailComponent implements OnInit{
  id = +(this.route.snapshot.paramMap.get('id')!);
  notice$ = this.store.select(getNoticeById(this.id));
  creator$? : Observable<User | undefined>;
  selectedProduct? : Product; 
  currentUser$ = this.store.select(getLoggedInUser);
  showDeletePopup = false;
  toggleMessagePopup = false;
  Status = Status;
  status = this.store.select(getNoticesStatus);

  constructor(private store: Store<{notices: Notice[]}>, private route: ActivatedRoute, private router: Router, public authService: AuthService,
    private noticesService : NoticesService) {
  }
  
  ngOnInit(): void {
    this.noticesService.loadNoticeById(this.id);
    this.notice$.subscribe(notice => {
      if (notice) {
        this.store.dispatch(loadUserByIdRequest({id: notice.userId}));
        this.selectedProduct = notice.products[0];

        this.creator$ = this.store.select(getUserById(notice.userId));
      }
    })
  }

  setSelectedProduct(product: Product) {
    this.selectedProduct = product;
  }

  getTotalPrice(notice: Notice) {
    return notice?.products.reduce((sum, product) => sum + product.price, 0);
  }

  deleteNotice() {
    this.store.dispatch(deleteNoticeRequest({noticeId: +this.id!}))
    this.router.navigate(['/']);
  }

  handleMessagePopup() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.dispatchMessage()
      } else {
        this.authService.loginWithPopup()
      }
    })
  }

  dispatchMessage() {
    this.store.select(getConversationByNoticeId(+this.id!)).subscribe(existingConversation => {
      if (existingConversation == undefined ) {
        this.toggleMessagePopup = true;
        return;
      } else if (existingConversation) {
        this.router.navigate(['conversations/', existingConversation.id]);
      }
    })
  }
      
}
