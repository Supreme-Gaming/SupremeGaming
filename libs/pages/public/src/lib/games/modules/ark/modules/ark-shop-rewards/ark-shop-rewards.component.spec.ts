import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkShopRewardsComponent } from './ark-shop-rewards.component';

describe('ArkShopRewardsComponent', () => {
  let component: ArkShopRewardsComponent;
  let fixture: ComponentFixture<ArkShopRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkShopRewardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkShopRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
