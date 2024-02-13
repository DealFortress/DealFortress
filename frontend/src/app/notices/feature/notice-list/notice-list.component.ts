import { Component,OnInit } from '@angular/core';
import { getNotices, getNoticesStatus } from '@app/notices/data-access/store/notices.selectors';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store'
import { loadNoticesRequest } from '@app/notices/data-access/store/notices.actions';
import { Status } from '@app/shared/models/state.model';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit{
  faPlusCircle = faPlusCircle;
  notices$ = this.store.select(getNotices);
  status = this.store.select(getNoticesStatus);
  Status = Status;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    console.log('test');
    this.store.dispatch(loadNoticesRequest());
  }
}
