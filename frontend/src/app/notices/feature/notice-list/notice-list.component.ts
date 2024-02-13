import { Component,OnChanges,OnInit, SimpleChanges } from '@angular/core';
import { getNoticePageSize, getNotices, getNoticesStatus, getPaginatedNotices } from '@app/notices/data-access/store/notices.selectors';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store'
import { loadNoticesRequest, setPageSize } from '@app/notices/data-access/store/notices.actions';
import { Status } from '@app/shared/models/state.model';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Notice } from '@app/shared/models/notice/notice.model';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit, OnChanges{
  Status = Status;
  currentPage = 0;
  pageSize = this.store.select(getNoticePageSize);
  notices$? : Observable< Notice[] | undefined >;
  status = this.store.select(getNoticesStatus);

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {
    this.pageSize.subscribe(pageSize => {
      if (pageSize) {
        this.store.dispatch(loadNoticesRequest({pageIndex: this.currentPage, pageSize: pageSize}));
        this.notices$ = this.store.select(getPaginatedNotices({pageIndex: this.currentPage, pageSize: pageSize}))
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

   
  }

  onPaginationEvent(event : PageEvent) {
    console.log(event)
    if (this.currentPage != event.pageIndex){
      this.currentPage = event.pageIndex;
      this.store.dispatch(loadNoticesRequest({pageIndex: this.currentPage, pageSize: event.pageSize}));
      this.notices$ = this.store.select(getPaginatedNotices({pageIndex: this.currentPage, pageSize: event.pageSize}))
    }
    this.store.select(getNoticePageSize).subscribe(pageSize => {
      if (pageSize && pageSize != event.pageSize) {
        this.store.dispatch(setPageSize({pageSize: event.pageSize}));
      }
    })
  }
}
