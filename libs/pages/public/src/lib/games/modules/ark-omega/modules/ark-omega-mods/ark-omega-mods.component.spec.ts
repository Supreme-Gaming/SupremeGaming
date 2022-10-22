import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaModsComponent } from './ark-omega-mods.component';

describe('ArkOmegaModsComponent', () => {
  let component: ArkOmegaModsComponent;
  let fixture: ComponentFixture<ArkOmegaModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
