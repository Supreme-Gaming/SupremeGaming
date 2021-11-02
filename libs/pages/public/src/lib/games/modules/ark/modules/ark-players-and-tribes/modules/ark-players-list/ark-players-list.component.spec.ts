import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPlayersListComponent } from './ark-players-list.component';

describe('ArkPlayersListComponent', () => {
  let component: ArkPlayersListComponent;
  let fixture: ComponentFixture<ArkPlayersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPlayersListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPlayersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
