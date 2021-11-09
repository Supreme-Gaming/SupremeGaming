import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasShopRewardsComponent } from './atlas-shop-rewards.component';

describe('AtlasShopRewardsComponent', () => {
  let component: AtlasShopRewardsComponent;
  let fixture: ComponentFixture<AtlasShopRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasShopRewardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasShopRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
