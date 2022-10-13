import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersComponent } from './space-engineers.component';

describe('SpaceEngineersComponent', () => {
  let component: SpaceEngineersComponent;
  let fixture: ComponentFixture<SpaceEngineersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
