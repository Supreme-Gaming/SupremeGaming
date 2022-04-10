import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasModsComponent } from './atlas-mods.component';

describe('AtlasModsComponent', () => {
  let component: AtlasModsComponent;
  let fixture: ComponentFixture<AtlasModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
