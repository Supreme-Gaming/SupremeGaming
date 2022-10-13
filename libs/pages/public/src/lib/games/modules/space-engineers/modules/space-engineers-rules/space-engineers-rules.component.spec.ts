import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersRulesComponent } from './space-engineers-rules.component';

describe('SpaceEngineersRulesComponent', () => {
  let component: SpaceEngineersRulesComponent;
  let fixture: ComponentFixture<SpaceEngineersRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
