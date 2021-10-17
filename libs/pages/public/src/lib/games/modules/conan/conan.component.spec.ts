import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanComponent } from './conan.component';

describe('ConanComponent', () => {
  let component: ConanComponent;
  let fixture: ComponentFixture<ConanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
