import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanSettingsComponent } from './conan-settings.component';

describe('ConanSettingsComponent', () => {
  let component: ConanSettingsComponent;
  let fixture: ComponentFixture<ConanSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
