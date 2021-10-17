import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkSettingsComponent } from './ark-settings.component';

describe('ArkSettingsComponent', () => {
  let component: ArkSettingsComponent;
  let fixture: ComponentFixture<ArkSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
