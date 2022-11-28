import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationSelectionsReviewComponent } from './donation-selections-review.component';

describe('DonationSelectionsReviewComponent', () => {
  let component: DonationSelectionsReviewComponent;
  let fixture: ComponentFixture<DonationSelectionsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationSelectionsReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationSelectionsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
