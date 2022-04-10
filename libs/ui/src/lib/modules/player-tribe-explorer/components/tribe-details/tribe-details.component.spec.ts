import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribeDetailsComponent } from './tribe-details.component';

describe('TribeDetailsComponent', () => {
  let component: TribeDetailsComponent;
  let fixture: ComponentFixture<TribeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TribeDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TribeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
