import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationPackageSelectionComponent } from './donation-package-selection.component';

describe('DonationPackageSelectionComponent', () => {
  let component: DonationPackageSelectionComponent;
  let fixture: ComponentFixture<DonationPackageSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonationPackageSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationPackageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
