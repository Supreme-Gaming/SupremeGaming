import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkLootTableComponent } from './ark-loot-table.component';

describe('ArkLootTableComponent', () => {
  let component: ArkLootTableComponent;
  let fixture: ComponentFixture<ArkLootTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkLootTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkLootTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
