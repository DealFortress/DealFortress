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
  productImageUrls = [ "https://bbs.io-tech.fi/data/attachments/1206/1206107-d8f567f5097c4556a54c1dd13fb0830d.jpg", 
  "https://bbs.io-tech.fi/data/attachments/1206/1206109-1cdf63f0fafabe98cd70458ea0071b85.jpg",
  "https://bbs.io-tech.fi/data/attachments/1206/1206108-42e11f5df36a295f1b6ee0a4fd3ea5ea.jpg",
  "https://bbs.io-tech.fi/data/attachments/1206/1206110-96f0e3e85e913f003b2e232672857f9a.jpg"]

  constructor(private store: Store<{notices: Notice[]}>, private route: ActivatedRoute) {
   
    this.notice.subscribe(notice => {
      if (notice) {
        this.store.dispatch(loadUserByIdRequest({id: notice.userId}))
      }
    })
  }
}
