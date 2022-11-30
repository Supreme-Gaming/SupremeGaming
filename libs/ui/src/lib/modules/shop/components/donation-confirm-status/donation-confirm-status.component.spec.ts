import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationConfirmStatusComponent } from './donation-confirm-status.component';

describe('DonationConfirmStatusComponent', () => {
  let component: DonationConfirmStatusComponent;
  let fixture: ComponentFixture<DonationConfirmStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationConfirmStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationConfirmStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
