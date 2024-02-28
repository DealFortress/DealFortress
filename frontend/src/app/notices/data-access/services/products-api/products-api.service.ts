import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@app/shared/models/product/product.model';
import { SoldStatus } from '@app/shared/models/sold-status.model';
import { environment } from 'environments/environment.production';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private baseUrl = environment.apiServerUrl;
  private noticesUrl = `${this.baseUrl}/products`;


  constructor(private httpClient: HttpClient) { }

  patchProductSoldStatusAPI(productId: number, soldStatus: SoldStatus): Observable<Product> {
    return this.httpClient
        .patch(
            `${this.noticesUrl}/${productId}/soldstatus/${soldStatus}`, {})
        .pipe(data => data as Observable<Product>);
  }
}
