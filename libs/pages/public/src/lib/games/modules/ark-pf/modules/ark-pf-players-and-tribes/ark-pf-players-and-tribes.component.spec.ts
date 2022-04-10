import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfPlayersAndTribesComponent } from './ark-pf-players-and-tribes.component';

describe('ArkPfPlayersAndTribesComponent', () => {
  let component: ArkPfPlayersAndTribesComponent;
  let fixture: ComponentFixture<ArkPfPlayersAndTribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfPlayersAndTribesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfPlayersAndTribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
