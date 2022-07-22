/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CourtService } from './Court.service';

describe('Service: Court', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourtService]
    });
  });

  it('should ...', inject([CourtService], (service: CourtService) => {
    expect(service).toBeTruthy();
  }));
});
