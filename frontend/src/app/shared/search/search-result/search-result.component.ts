import {Component, Input, OnInit} from '@angular/core';
import { Notice } from '@app/shared/models/notice/notice.model';
import { Product } from '@app/shared/models/product/product.model';
import { noticeSearchResult } from '@app/shared/models/search-result.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  @Input({required: true}) result!: noticeSearchResult;
  // notice? : Partial<Notice>;

  constructor() { }


  ngOnInit(): void {

    const ids = this.result['products.id'].raw;
    const products : Product[] = [];

    for (let i = 0; i < products.length; i++) {

      // MODIFY SERVER RESPONSE TO GET PRODUCT ID AND THEN FILTER BY PRODUCT ID
      const images = {
        url: this.result['products.images.url'].raw[i]
      }

      const product : Product = {
      id: this.result['products.id'].raw[i],
      categoryId:this.result['products.categoryId'].raw[i],
      condition: this.result['products.condition'].raw[i],
      name: this.result['products.name'].raw[i],
      noticeId:this.result['products.noticeId'].raw[i],
      price:this.result['products.price'].raw[i],
      soldStatus:this.result['products.soldStatus'].raw[i],
      warranty:this.result['products.warranty'].raw[i],
      isSoldSeparately: this.result['products.isSoldSeparately'].raw[i],
      hasReceipt: this.result['products.hasReceipt'].raw[i],
      images: [images]
      }

      products.push(product)
      
    }

    // if (this.result) {
    //   this.notice = {
    //     id: +(this.result.id.raw),
    //     userId: this.result.userId.raw,
    //     title: this.result.title.raw,
    //     description: this.result.description.raw,
    //     city: this.result.city.raw,
    //     payments: this.result.payments.raw,
    //     deliveryMethods: this.result.deliveryMethods.raw,
    //     createdAt: this.result.createdAt.raw
    //   }
    // }
    // console.log(this.notice);
  }


}