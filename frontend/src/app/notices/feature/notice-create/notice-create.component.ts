import { Component } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { postNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getLoggedInUserLatestNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { NoticeRequest } from '@app/shared/models/notice/notice-request.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-notice-create',
  templateUrl: './notice-create.component.html',
  styleUrls: ['./notice-create.component.css']
})
export class NoticeCreateComponent {

  constructor(private store: Store, private router: Router, private formBuilder: FormBuilder) {}

  submitRequest(postRequest: NoticeRequest) {
    this.store.dispatch(postNoticeRequest({request: postRequest}));
    this.navigateToNewNotice()
  }
  
  navigateToNewNotice() {
    this.store.select(getLoggedInUserLatestNoticeId).subscribe(id => {
      if (id) {
        this.router.navigate(['notices/', id]);
      }
    })
  }
}
