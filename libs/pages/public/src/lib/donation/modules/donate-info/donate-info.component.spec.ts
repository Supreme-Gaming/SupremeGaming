import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateInfoComponent } from './donate-info.component';

describe('DonateInfoComponent', () => {
  let component: DonateInfoComponent;
  let fixture: ComponentFixture<DonateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
