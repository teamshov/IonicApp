import { TestBed } from '@angular/core/testing';

import { ShovService } from './shov.service';

describe('ShovService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShovService = TestBed.get(ShovService);
    expect(service).toBeTruthy();
  });
});
