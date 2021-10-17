import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfPluginsComponent } from './ark-pf-plugins.component';

describe('ArkPfPluginsComponent', () => {
  let component: ArkPfPluginsComponent;
  let fixture: ComponentFixture<ArkPfPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfPluginsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
