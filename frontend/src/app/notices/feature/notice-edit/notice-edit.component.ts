import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { putNoticeRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById, getUserLatestNoticeId } from '@app/notices/data-access/store/notices.selectors';
import { NoticeRequest } from '@app/shared/models/notice-request.model';
import { Product } from '@app/shared/models/product.model';
import { Image } from '@app/shared/models/image.model';
import { Store } from '@ngrx/store';
import { Notice } from '@app/shared/models/notice.model';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.component.html',
  styleUrls: ['./notice-edit.component.css']
})
export class NoticeEditComponent {
  id = this.route.snapshot.paramMap.get('id');
  notice$ = this.store.select(getNoticeById(+this.id!));
  noticeForm?: FormGroup;

  constructor(private store: Store, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.notice$.subscribe(notice => {
      if (notice) {
        this.noticeForm = this.createNoticeFormGroup(notice)
      }
    })
  }

  createNoticeFormGroup(notice : Notice) {
    return this.formBuilder.group({
      userId: [notice?.userId],
      title: [notice?.title, [Validators.required, Validators.minLength(10)]],
      description: [notice?.description, [Validators.required, Validators.minLength(30)]],
      city: [notice?.city, [Validators.required, Validators.minLength(1)]],
      payments: [notice?.payments, [Validators.required, Validators.minLength(1)]],
      createdAt: [notice?.createdAt],
      deliveryMethods: [notice?.deliveryMethods, [Validators.required, Validators.minLength(1)]],
      productRequests: this.formBuilder.array(this.createProductFormGroups(notice?.products), [Validators.required, Validators.minLength(1)])
    });
  }

  createProductFormGroups(products: Product[]) {
    return products.map(product => {
      console.log(product.soldStatus.valueOf())
       return this.formBuilder.group({
            name: product.name,
            price: product.price,
            soldStatus: product.soldStatus.valueOf(),
            isSoldSeparately: product.isSoldSeparately,
            hasReceipt: product.hasReceipt,
            warranty: product.warranty,
            categoryId: product.categoryId,
            condition: product.condition,
            imageRequests: this.formBuilder.array(
              this.createImagesFormGroups(product.images)
            ), 
        });
    })
  }

  createImagesFormGroups(images : Image[]) {
    return images.map(image => {
      return this.formBuilder.group({
        url: [image.url]
      });
    })
  }
      
  submitRequest(putRequest: NoticeRequest) {
    this.store.dispatch(putNoticeRequest({request: putRequest, noticeId: +this.id!}));
    this.navigateToNewNotice(+this.id!);
  }

  navigateToNewNotice(id: number) {
      if (id) {
        this.router.navigate(['notices/', id]);
      }
  }
}