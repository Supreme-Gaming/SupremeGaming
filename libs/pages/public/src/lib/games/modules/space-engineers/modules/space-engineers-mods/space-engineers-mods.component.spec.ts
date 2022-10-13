import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEngineersModsComponent } from './space-engineers-mods.component';

describe('SpaceEngineersModsComponent', () => {
  let component: SpaceEngineersModsComponent;
  let fixture: ComponentFixture<SpaceEngineersModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceEngineersModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEngineersModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
