import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribeSearchListComponent } from './tribe-search-list.component';

describe('TribeSearchListComponent', () => {
  let component: TribeSearchListComponent;
  let fixture: ComponentFixture<TribeSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TribeSearchListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TribeSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
