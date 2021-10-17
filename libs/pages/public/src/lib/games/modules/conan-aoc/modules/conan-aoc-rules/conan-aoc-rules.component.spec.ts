import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocRulesComponent } from './conan-aoc-rules.component';

describe('ConanAocRulesComponent', () => {
  let component: ConanAocRulesComponent;
  let fixture: ComponentFixture<ConanAocRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanAocRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
