import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkModsComponent } from './ark-mods.component';

describe('ArkModsComponent', () => {
  let component: ArkModsComponent;
  let fixture: ComponentFixture<ArkModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkModsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
