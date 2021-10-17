import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConanPlayersAndTribesComponent } from './conan-players-and-tribes.component';

describe('ConanPlayersAndTribesComponent', () => {
  let component: ConanPlayersAndTribesComponent;
  let fixture: ComponentFixture<ConanPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConanPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConanPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
