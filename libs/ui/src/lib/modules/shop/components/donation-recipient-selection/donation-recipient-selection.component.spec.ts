import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationRecipientSelectionComponent } from './donation-recipient-selection.component';

describe('DonationRecipientSelectionComponent', () => {
  let component: DonationRecipientSelectionComponent;
  let fixture: ComponentFixture<DonationRecipientSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationRecipientSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationRecipientSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
