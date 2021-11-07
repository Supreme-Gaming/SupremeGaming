import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationMethodSelectionComponent } from './donation-method-selection.component';

describe('DonationMethodSelectionComponent', () => {
  let component: DonationMethodSelectionComponent;
  let fixture: ComponentFixture<DonationMethodSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationMethodSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationMethodSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
