import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getNoticeById } from '@app/notices/data-access/store/notices.selectors';
import { Notice } from '@app/shared/models/notice.model';
import { User } from '@app/shared/models/user.model';
import { loadUserByIdRequest } from '@app/users/data-access/store/users.actions';
import { getCurrentlyShownUser} from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notice-detail',
  templateUrl: './notice-detail.component.html',
  styleUrls: ['./notice-detail.component.css']
})
export class NoticeDetailComponent{
  id = this.route.snapshot.paramMap.get('id');
  notice = this.store.select(getNoticeById(+this.id!));
  creator = this.store.select(getCurrentlyShownUser)

  constructor(private store: Store<{notices: Notice[]}>, private route: ActivatedRoute) {
   
    this.notice.subscribe(notice => {
      if (notice) {
        this.store.dispatch(loadUserByIdRequest({id: notice.userId}))
      }
    })
  }
}
