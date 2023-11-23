import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { postNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getUserLatestNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { NoticeRequest } from '@app/shared/models/notice-request.model';
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

  noticeFormGroup = this.formBuilder.group({
    userId: [],
    title: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required, Validators.minLength(30)]],
    city: ['', [Validators.required, Validators.minLength(1)]],
    payments: [[''], [Validators.required, Validators.minLength(1)]],
    deliveryMethods: [[''], [Validators.required, Validators.minLength(1)]],
    productRequests: this.formBuilder.array([
      this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        price: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
        isSold: [false],
        isSoldSeparately: [false],
        hasReceipt: [false],
        warranty: [''],
        categoryId: [0],
        condition: [0],
        imageRequests: this.formBuilder.array([
          this.formBuilder.group({
            url: ['', [Validators.required]]
          })
        ], [Validators.required, Validators.minLength(1)]),  
      })
    ], [Validators.required, Validators.minLength(1)])
  });

  
  navigateToNewNotice() {
    this.store.select(getUserLatestNoticeId).subscribe(id => {
      if (id) {
        this.router.navigate(['notices/', id]);
      }
    })
  }
}
