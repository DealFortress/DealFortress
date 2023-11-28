import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { patchProductIsSoldRequest } from '@app/notices/data-access/store/notices.actions';
import { getNoticeById } from '@app/notices/data-access/store/notices.selectors';
import { Condition } from '@app/shared/models/condition.model';
import { Notice } from '@app/shared/models/notice.model';
import { Product } from '@app/shared/models/product.model';
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
  notice$? : Observable<Notice | undefined>;
  user$ = this.store.select(getUser);

  constructor(private store: Store, private renderer: Renderer2) {
  }

  toggleSoldStatus() {
    this.store.dispatch(patchProductIsSoldRequest({ productId: this.product.id }))
  }

  ngOnInit(): void {
    this.notice$ = this.store.select(getNoticeById(this.product.noticeId))
    this.condition = Condition[this.product.condition];  
  }

  handleFlagColor(isSold: boolean) {
    if (isSold) {
      this.renderer
    }
  }
}
