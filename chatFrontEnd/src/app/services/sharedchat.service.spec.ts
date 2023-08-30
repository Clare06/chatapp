import { TestBed } from '@angular/core/testing';

import { SharedchatService } from './sharedchat.service';

describe('SharedchatService', () => {
  let service: SharedchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
