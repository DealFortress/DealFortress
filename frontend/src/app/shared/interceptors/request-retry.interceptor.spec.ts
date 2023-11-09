import { TestBed } from '@angular/core/testing';

import { RequestRetryInterceptor } from './request-retry.interceptor';

describe('RequestRetryInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RequestRetryInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RequestRetryInterceptor = TestBed.inject(RequestRetryInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
