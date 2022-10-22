import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaSettingsComponent } from './ark-omega-settings.component';

describe('ArkOmegaSettingsComponent', () => {
  let component: ArkOmegaSettingsComponent;
  let fixture: ComponentFixture<ArkOmegaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
