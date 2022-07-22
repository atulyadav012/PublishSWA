import { TestBed } from '@angular/core/testing';

import { AttorneyService } from './attorney.service';

describe('AttorneyService', () => {
  let service: AttorneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttorneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
