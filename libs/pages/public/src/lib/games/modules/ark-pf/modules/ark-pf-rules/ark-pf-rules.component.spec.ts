import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfRulesComponent } from './ark-pf-rules.component';

describe('ArkPfRulesComponent', () => {
  let component: ArkPfRulesComponent;
  let fixture: ComponentFixture<ArkPfRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
