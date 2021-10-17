import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPlayersAndTribesComponent } from './ark-players-and-tribes.component';

describe('ArkPlayersAndTribesComponent', () => {
  let component: ArkPlayersAndTribesComponent;
  let fixture: ComponentFixture<ArkPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
