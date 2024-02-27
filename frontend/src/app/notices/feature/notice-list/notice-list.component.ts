import { Component,OnChanges,OnInit, SimpleChanges } from '@angular/core';
import { getMetaData, getNoticePagination, getNotices, getNoticesStatus, getPagedNotices } from '@app/notices/data-access/store/notices.selectors';
import { Store } from '@ngrx/store'
import { loadNoticesRequest, setNoticesRequest, setPagination } from '@app/notices/data-access/store/notices.actions';
import { Status } from '@app/shared/models/state.model';
import { PageEvent } from '@angular/material/paginator';
import { Notice } from '@app/shared/models/notice/notice.model';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit{
  Status = Status;
  pageIndex = 0;
  pageSize = 2;
  notices$ = this.store.select(getPagedNotices);
  metaData$? = this.store.select(getMetaData);
  status$ = this.store.select(getNoticesStatus);

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {
    this.store.select(getNoticePagination).subscribe(pag => {
      if (pag) {
        this.pageSize = pag.pageSize;
        this.pageIndex = pag.pageIndex;
        this.store.dispatch(setNoticesRequest({pageIndex: this.pageIndex, pageSize: this.pageSize}));
      }
    })
  }


  onPaginationEvent(event : PageEvent) {

    if (event.pageIndex > this.pageIndex ){
      this.store.dispatch(loadNoticesRequest({pageIndex: event.pageIndex, pageSize: event.pageSize}));
    }

    if (event.pageSize != this.pageSize || event.pageIndex != this.pageIndex) {
      this.store.dispatch(setPagination({pageSize: event.pageSize, pageIndex: event.pageIndex}));
      this.store.dispatch(loadNoticesRequest({pageIndex: event.pageIndex, pageSize: event.pageSize}));
    }
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}

