import { TestBed } from '@angular/core/testing';

import { ArkSupplyDropsService } from './ark-supply-drops.service';

describe('ArkSupplyDropsService', () => {
  let service: ArkSupplyDropsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArkSupplyDropsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
