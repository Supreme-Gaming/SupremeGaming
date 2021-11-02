import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchListComponent } from './player-search-list.component';

describe('PlayerSearchListComponent', () => {
  let component: PlayerSearchListComponent;
  let fixture: ComponentFixture<PlayerSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSearchListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
