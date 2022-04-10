import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasSettingsComponent } from './atlas-settings.component';

describe('AtlasSettingsComponent', () => {
  let component: AtlasSettingsComponent;
  let fixture: ComponentFixture<AtlasSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
