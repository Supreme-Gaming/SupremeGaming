import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanRulesComponent } from './conan-rules.component';

describe('ConanRulesComponent', () => {
  let component: ConanRulesComponent;
  let fixture: ComponentFixture<ConanRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
