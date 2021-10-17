import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPluginsComponent } from './atlas-plugins.component';

describe('AtlasPluginsComponent', () => {
  let component: AtlasPluginsComponent;
  let fixture: ComponentFixture<AtlasPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtlasPluginsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
