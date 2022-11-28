import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlatformSelectionComponent } from './game-platform-selection.component';

describe('GamePlatformSelectionComponent', () => {
  let component: GamePlatformSelectionComponent;
  let fixture: ComponentFixture<GamePlatformSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePlatformSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlatformSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
