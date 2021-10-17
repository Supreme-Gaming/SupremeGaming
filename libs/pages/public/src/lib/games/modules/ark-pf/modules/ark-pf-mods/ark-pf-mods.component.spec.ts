import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfModsComponent } from './ark-pf-mods.component';

describe('ArkPfModsComponent', () => {
  let component: ArkPfModsComponent;
  let fixture: ComponentFixture<ArkPfModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
