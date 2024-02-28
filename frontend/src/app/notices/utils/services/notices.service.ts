import { Injectable } from '@angular/core';
import { loadNoticeByIdRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById } from '@app/notices/data-access/store/notices.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NoticesService {

  constructor(private store : Store) { }

  loadNoticeById(id: number) {
    const cache : number[] = [];

    this.store.select(getNoticeById(id)).subscribe(recipient => {
      if (recipient) {
        return;
      }
      cache.push(id)

      if (cache.length > 4) {
        cache.pop()
      }
      this.store.dispatch(loadNoticeByIdRequest({id :id}));
    })
  }
}

