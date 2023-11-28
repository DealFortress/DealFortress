import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { patchProductIsSoldRequest } from '@app/notices/data-access/store/notices.actions';
import { Condition } from '@app/shared/models/condition.model';
import { Product } from '@app/shared/models/product.model';
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

  constructor(private store: Store) {}

  toggleSoldStatus() {
    this.store.dispatch(patchProductIsSoldRequest({ productId: this.product.id }))
  }

  ngOnInit(): void {
    this.condition = Condition[this.product.condition];  
  }
}
