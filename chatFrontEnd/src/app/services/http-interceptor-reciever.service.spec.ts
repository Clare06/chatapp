import { TestBed } from '@angular/core/testing';

import { HttpInterceptorRecieverService } from './http-interceptor-reciever.service';

describe('HttpInterceptorRecieverService', () => {
  let service: HttpInterceptorRecieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptorRecieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
