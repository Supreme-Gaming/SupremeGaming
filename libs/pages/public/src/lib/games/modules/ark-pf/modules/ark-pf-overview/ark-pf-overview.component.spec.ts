import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfOverviewComponent } from './ark-pf-overview.component';

describe('ArkOverviewComponent', () => {
  let component: ArkPfOverviewComponent;
  let fixture: ComponentFixture<ArkPfOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
