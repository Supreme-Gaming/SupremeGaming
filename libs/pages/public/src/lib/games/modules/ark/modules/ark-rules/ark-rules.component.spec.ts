import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkRulesComponent } from './ark-rules.component';

describe('ArkRulesComponent', () => {
  let component: ArkRulesComponent;
  let fixture: ComponentFixture<ArkRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
