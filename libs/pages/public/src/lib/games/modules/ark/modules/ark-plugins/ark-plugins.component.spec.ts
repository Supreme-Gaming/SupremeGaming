import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPluginsComponent } from './ark-plugins.component';

describe('ArkPluginsComponent', () => {
  let component: ArkPluginsComponent;
  let fixture: ComponentFixture<ArkPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkPluginsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
