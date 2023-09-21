import { TestBed } from '@angular/core/testing';

import { KeypairService } from './keypair.service';

describe('KeypairService', () => {
  let service: KeypairService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeypairService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
