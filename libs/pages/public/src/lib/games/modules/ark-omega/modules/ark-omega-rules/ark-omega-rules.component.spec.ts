import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaRulesComponent } from './ark-omega-rules.component';

describe('ArkOmegaRulesComponent', () => {
  let component: ArkOmegaRulesComponent;
  let fixture: ComponentFixture<ArkOmegaRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
