import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '@app/shared/models/category.model';
import { environment } from 'environments/environment.production';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

    private baseUrl = environment.apiServerUrl;
    private categoriesUrl = `${this.baseUrl}/categories`;

    constructor(private httpClient: HttpClient) {
    }

    getAllCategoriesAPI(): Observable<Category[]>{
        return this.httpClient
            .get(this.categoriesUrl)
            .pipe(data => data as Observable<Category[]>);
    }
}