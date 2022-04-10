import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanModsComponent } from './conan-mods.component';

describe('ConanModsComponent', () => {
  let component: ConanModsComponent;
  let fixture: ComponentFixture<ConanModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
