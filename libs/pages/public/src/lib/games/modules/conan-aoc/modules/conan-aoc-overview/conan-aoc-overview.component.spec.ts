import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocOverviewComponent } from './conan-aoc-overview.component';

describe('ConanAocOverviewComponent', () => {
  let component: ConanAocOverviewComponent;
  let fixture: ComponentFixture<ConanAocOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanAocOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
