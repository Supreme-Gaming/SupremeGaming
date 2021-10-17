import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRulesComponent } from './community-rules.component';

describe('CommunityRulesComponent', () => {
  let component: CommunityRulesComponent;
  let fixture: ComponentFixture<CommunityRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
