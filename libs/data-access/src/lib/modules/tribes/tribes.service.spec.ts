import { TestBed } from '@angular/core/testing';

import { TribesService } from './tribes.service';

describe('TribesService', () => {
  let service: TribesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TribesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
