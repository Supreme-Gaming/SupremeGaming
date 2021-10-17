import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocPippiComponent } from './conan-aoc-pippi.component';

describe('ConanAocPippiComponent', () => {
  let component: ConanAocPippiComponent;
  let fixture: ComponentFixture<ConanAocPippiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanAocPippiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocPippiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
