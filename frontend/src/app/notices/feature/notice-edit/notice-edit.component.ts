import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { postNoticeRequest, putNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById, getUserLatestNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { Notice } from '@app/shared/models/notice.model';
import { Product } from '@app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs-compat';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.component.html',
  styleUrls: ['./notice-edit.component.css']
})
export class NoticeEditComponent {
  id = this.route.snapshot.paramMap.get('id');
  notice$ = this.store.select(getNoticeById(+this.id!));
  public noticeForm: FormGroup;

  constructor(private store: Store, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.noticeForm = this.noticeFormGroup;
  }

  submitRequest(putRequest: NoticeRequest) {
    this.store.dispatch(putNoticeRequest({request: putRequest, noticeId: +this.id!}));
    this.navigateToNewNotice();
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

   
  addProduct(product: Product) {
    var imageRequests = this.noticeForm.get('imageRequests') as FormArray;
    
    imageRequests.push(this.formBuilder.group({
          name: [product.name],
          price: [product.price],
          isSold: [product.isSold],
          isSoldSeparately: [product.isSoldSeparately],
          hasReceipt: [product.hasReceipt],
          warranty: [product.warranty],
          categoryId: [product.categoryId],
          condition: [product.condition],
          imageRequests: this.formBuilder.array([
            this.formBuilder.group({
              url: ['']
            })
          ]), 
        }));
  }

  
  navigateToNewNotice() {
    this.store.select(getUserLatestNoticeId).subscribe(id => {
      if (id) {
        this.router.navigate(['notices/', id]);
      }
    })
  }
}
