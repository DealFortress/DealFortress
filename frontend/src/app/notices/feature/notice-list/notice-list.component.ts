import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoticesState } from '@app/notices/data-access/store/notice.state';
import { getNotices } from '@app/notices/data-access/store/notices.selectors';
import { Notice } from '@app/shared/models/notice.model';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent {
  faPlusCircle = faPlusCircle;
  notices$ : Observable<Notice[]>;

  constructor(store: Store<{noticesState: NoticesState}>) {
    this.notices$ = store.select(getNotices);
  }
}
