import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkLootCrateComponent } from './ark-loot-crate.component';

describe('ArkLootCrateComponent', () => {
  let component: ArkLootCrateComponent;
  let fixture: ComponentFixture<ArkLootCrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkLootCrateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkLootCrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
