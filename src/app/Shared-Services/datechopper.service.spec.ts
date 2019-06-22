import { TestBed } from '@angular/core/testing';

import { DatechopperService } from './datechopper.service';

describe('DatechopperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatechopperService = TestBed.get(DatechopperService);
    expect(service).toBeTruthy();
  });
});
