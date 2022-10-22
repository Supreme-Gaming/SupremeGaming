import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaPlayersAndTribesComponent } from './ark-omega-players-and-tribes.component';

describe('ArkOmegaPlayersAndTribesComponent', () => {
  let component: ArkOmegaPlayersAndTribesComponent;
  let fixture: ComponentFixture<ArkOmegaPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
