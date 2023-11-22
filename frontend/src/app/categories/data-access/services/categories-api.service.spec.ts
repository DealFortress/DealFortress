import { TestBed } from '@angular/core/testing';

import { CategoriesApiService } from './categories-api.service';

describe('CategoriesService', () => {
  let service: CategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
