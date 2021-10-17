import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkSupplyDropsComponent } from './ark-supply-drops.component';

describe('ArkSupplyDropsComponent', () => {
  let component: ArkSupplyDropsComponent;
  let fixture: ComponentFixture<ArkSupplyDropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkSupplyDropsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkSupplyDropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
