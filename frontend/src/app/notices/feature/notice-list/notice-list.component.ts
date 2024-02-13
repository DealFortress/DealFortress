import { Component,OnInit } from '@angular/core';
import { getNoticePageSize, getNotices, getNoticesStatus } from '@app/notices/data-access/store/notices.selectors';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store'
import { loadNoticesRequest, setPageSize } from '@app/notices/data-access/store/notices.actions';
import { Status } from '@app/shared/models/state.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit{
  faPlusCircle = faPlusCircle;
  notices$ = this.store.select(getPaginatedNotices);
  status = this.store.select(getNoticesStatus);
  Status = Status;
  pageSize = this.store.select(getNoticePageSize);

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(loadNoticesRequest({page: 0}));
  }

  onPaginationEvent(event : PageEvent) {
    this.store.select(getNoticePageSize).subscribe(pageSize => {
      if (pageSize && pageSize != event.pageSize) {
        this.store.dispatch(setPageSize({pageSize: event.pageSize}));
      }
    })
  }
}
