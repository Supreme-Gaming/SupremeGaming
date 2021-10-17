import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanAocPlayersAndTribesComponent } from './conan-aoc-players-and-tribes.component';

describe('ConanAocPlayersAndTribesComponent', () => {
  let component: ConanAocPlayersAndTribesComponent;
  let fixture: ComponentFixture<ConanAocPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanAocPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanAocPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
