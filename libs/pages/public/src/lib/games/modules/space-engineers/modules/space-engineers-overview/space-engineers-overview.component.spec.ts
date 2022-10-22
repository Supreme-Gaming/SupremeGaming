import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersOverviewComponent } from './space-engineers-overview.component';

describe('SpaceEngineersOverviewComponent', () => {
  let component: SpaceEngineersOverviewComponent;
  let fixture: ComponentFixture<SpaceEngineersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
