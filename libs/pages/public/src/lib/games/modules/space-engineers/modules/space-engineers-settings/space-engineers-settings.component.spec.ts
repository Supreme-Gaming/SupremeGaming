import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersSettingsComponent } from './space-engineers-settings.component';

describe('SpaceEngineersSettingsComponent', () => {
  let component: SpaceEngineersSettingsComponent;
  let fixture: ComponentFixture<SpaceEngineersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
