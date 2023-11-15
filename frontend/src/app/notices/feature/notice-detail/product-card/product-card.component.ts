import { Component, Input } from '@angular/core';
import { Product } from '@app/shared/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product?: Product;
}
