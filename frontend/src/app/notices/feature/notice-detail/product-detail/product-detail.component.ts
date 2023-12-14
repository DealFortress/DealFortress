import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getCategoryById } from '@app/categories/data-access/store/categories.selectors';
import { Category } from '@app/shared/models/category.model';
import { Condition } from '@app/shared/models/condition.model';
import { Product } from '@app/shared/models/product/product.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnChanges{
  @Input({required: true}) product!: Product;
  condition: string = "";
  toggleFullscreen = false;
  category$?: Observable<Category | undefined>;

  ngOnChanges(changes: SimpleChanges): void {
    this.condition = Condition[this.product.condition];  
    this.category$ = this.store.select(getCategoryById(this.product.categoryId));
  }


  constructor(private store: Store) {
  }
}
