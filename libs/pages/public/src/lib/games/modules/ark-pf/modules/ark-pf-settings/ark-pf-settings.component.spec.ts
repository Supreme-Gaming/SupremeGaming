import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfSettingsComponent } from './ark-pf-settings.component';

describe('ArkPfSettingsComponent', () => {
  let component: ArkPfSettingsComponent;
  let fixture: ComponentFixture<ArkPfSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
