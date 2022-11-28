import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatePaypalComponent } from './donate-paypal.component';

describe('DonatePaypalComponent', () => {
  let component: DonatePaypalComponent;
  let fixture: ComponentFixture<DonatePaypalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonatePaypalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonatePaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
