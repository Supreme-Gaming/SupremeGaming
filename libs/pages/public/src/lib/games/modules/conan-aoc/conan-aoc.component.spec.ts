import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocComponent } from './conan-aoc.component';

describe('ConanAocComponent', () => {
  let component: ConanAocComponent;
  let fixture: ComponentFixture<ConanAocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConanAocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
