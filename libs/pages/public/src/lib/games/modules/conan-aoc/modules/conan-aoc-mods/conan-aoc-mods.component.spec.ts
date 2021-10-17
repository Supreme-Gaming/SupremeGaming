import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocModsComponent } from './conan-aoc-mods.component';

describe('ConanAocModsComponent', () => {
  let component: ConanAocModsComponent;
  let fixture: ComponentFixture<ConanAocModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConanAocModsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
