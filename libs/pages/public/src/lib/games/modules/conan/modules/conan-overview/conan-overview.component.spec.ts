import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanOverviewComponent } from './conan-overview.component';

describe('ConanOverviewComponent', () => {
  let component: ConanOverviewComponent;
  let fixture: ComponentFixture<ConanOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
