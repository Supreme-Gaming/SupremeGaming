import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasOverviewComponent } from './atlas-overview.component';

describe('AtlasOverviewComponent', () => {
  let component: AtlasOverviewComponent;
  let fixture: ComponentFixture<AtlasOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
