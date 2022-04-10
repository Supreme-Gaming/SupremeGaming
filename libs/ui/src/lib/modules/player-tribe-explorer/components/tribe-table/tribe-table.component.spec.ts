import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribeTableComponent } from './tribe-table.component';

describe('TribeTableComponent', () => {
  let component: TribeTableComponent;
  let fixture: ComponentFixture<TribeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TribeTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TribeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
