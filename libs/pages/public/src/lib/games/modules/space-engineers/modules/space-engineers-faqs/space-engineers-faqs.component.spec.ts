import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersFAQsComponent } from './space-engineers-faqs.component';

describe('SpaceEngineersFAQsComponent', () => {
  let component: SpaceEngineersFAQsComponent;
  let fixture: ComponentFixture<SpaceEngineersFAQsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersFAQsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersFAQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
