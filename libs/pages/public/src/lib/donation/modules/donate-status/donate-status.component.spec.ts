import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateStatusComponent } from './donate-status.component';

describe('DonateStatusComponent', () => {
  let component: DonateStatusComponent;
  let fixture: ComponentFixture<DonateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
