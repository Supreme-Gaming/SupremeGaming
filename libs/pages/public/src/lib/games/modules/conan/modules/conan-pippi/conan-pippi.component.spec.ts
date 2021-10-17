import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanPippiComponent } from './conan-pippi.component';

describe('ConanPippiComponent', () => {
  let component: ConanPippiComponent;
  let fixture: ComponentFixture<ConanPippiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanPippiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanPippiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
