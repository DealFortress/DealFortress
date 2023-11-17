import { Component, Input } from '@angular/core';
import { Condition } from '@app/shared/models/condition.model';
import { Product } from '@app/shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent{
  @Input({required: true}) product!: Product;
  condition: string = "";
  toggleFullscreen = false;

  ngOnInit(): void {
    this.condition = Condition[this.product.condition];  
  }

}
