import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaPluginsComponent } from './ark-omega-plugins.component';

describe('ArkOmegaPluginsComponent', () => {
  let component: ArkOmegaPluginsComponent;
  let fixture: ComponentFixture<ArkOmegaPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaPluginsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
