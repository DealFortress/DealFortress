import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { getMetaData, getNoticePagination, getNoticesStatus, getPagedNotices } from '@app/notices/data-access/store/notices.selectors';
import { Store } from '@ngrx/store'
import { loadNoticesRequest, setNoticesRequest, setPagination } from '@app/notices/data-access/store/notices.actions';
import { Status } from '@app/shared/models/state.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit, OnDestroy{
  Status = Status;
  pageIndex = 0;
  pageSize = 2;
  notices$ = this.store.select(getPagedNotices);
  metaData$? = this.store.select(getMetaData);
  status$ = this.store.select(getNoticesStatus);
  @ViewChild('focus', { read: ElementRef }) focus!: ElementRef;

  constructor(private store: Store) {
  }
  
  ngOnInit(): void {
    const setInitialState = this.store.select(getNoticePagination).subscribe(pag => {
      if (pag) {
        this.pageSize = pag.pageSize;
        this.pageIndex = pag.pageIndex;
        this.store.dispatch(setNoticesRequest({pageIndex: this.pageIndex, pageSize: this.pageSize}));
      }
    })
    setInitialState.unsubscribe()
  }

  ngOnDestroy(): void {
    this.store.dispatch(setPagination({pageIndex: 0, pageSize: this.pageSize}))
  }
  
  numSequence = (n : number) => {
    return Array(n);
  }

  onPaginationEvent(event : PageEvent) {
    this.store.dispatch(setPagination({pageSize: event.pageSize, pageIndex: event.pageIndex}));

    if (event.pageIndex > this.pageIndex ){
      this.store.dispatch(loadNoticesRequest({pageIndex: event.pageIndex, pageSize: event.pageSize}));
    }
    
    if (event.pageSize != this.pageSize) {
      this.store.dispatch(setNoticesRequest({pageIndex: event.pageIndex, pageSize: event.pageSize}));
    }
   
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.focus.nativeElement.scrollIntoView({ behavior: 'smooth', block: "end" });
  }
}

