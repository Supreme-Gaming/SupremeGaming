import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPlayersAndTribesComponent } from './atlas-players-and-tribes.component';

describe('AtlasPlayersAndTribesComponent', () => {
  let component: AtlasPlayersAndTribesComponent;
  let fixture: ComponentFixture<AtlasPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
