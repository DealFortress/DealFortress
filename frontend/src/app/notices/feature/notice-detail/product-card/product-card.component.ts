import { Component, Input, OnInit } from '@angular/core';
import { Condition } from '@app/shared/models/condition.model';
import { Product } from '@app/shared/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit{
  @Input({required: true}) product!: Product;
  condition: string = "";

  ngOnInit(): void {
    this.condition = Condition[this.product.condition];  
  }
}
