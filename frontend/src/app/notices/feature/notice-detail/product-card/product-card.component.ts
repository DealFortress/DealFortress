import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { patchProductSoldStatusRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById } from '@app/notices/data-access/store/notices.selectors';
import { Condition } from '@app/shared/models/condition.model';
import { Notice } from '@app/shared/models/notice.model';
import { Product } from '@app/shared/models/product.model';
import { SoldStatus } from '@app/shared/models/sold-status.model';
import { getCurrentlyShownUser, getUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit{
  @Input({required: true}) product!: Product;
  condition: string = "";
  SoldStatus = SoldStatus;
  notice$? : Observable<Notice | undefined>;
  user$ = this.store.select(getUser);
  toggleSoldPopup = false;

  constructor(private store: Store) {
  }
 
  toggleSoldStatus(soldStatus : SoldStatus) {
    this.store.dispatch(patchProductSoldStatusRequest({ productId: this.product.id, soldStatus: soldStatus }))
  }

  ngOnInit(): void {
    this.notice$ = this.store.select(getNoticeById(this.product.noticeId))

    this.condition = Condition[this.product.condition];  
  }


  availability() {
    switch (this.product.soldStatus) {
      case 0:
        return {color: "bg-green", text: 'AVAILABLE'}
      case 1:
        return {color: "bg-[orange]", text: 'RESERVED'}
      case 2:
        return {color: "bg-transparent", text: ''}   
      default:
        return {color: "green", text: 'AVAILABLE'}
    }
  }

}
