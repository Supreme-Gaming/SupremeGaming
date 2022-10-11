import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaOverviewComponent } from './ark-omega-overview.component';

describe('ArkOverviewComponent', () => {
  let component: ArkOmegaOverviewComponent;
  let fixture: ComponentFixture<ArkOmegaOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
