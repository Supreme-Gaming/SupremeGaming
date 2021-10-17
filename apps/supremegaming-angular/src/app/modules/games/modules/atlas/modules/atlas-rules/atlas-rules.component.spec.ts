import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasRulesComponent } from './atlas-rules.component';

describe('AtlasRulesComponent', () => {
  let component: AtlasRulesComponent;
  let fixture: ComponentFixture<AtlasRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasRulesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
