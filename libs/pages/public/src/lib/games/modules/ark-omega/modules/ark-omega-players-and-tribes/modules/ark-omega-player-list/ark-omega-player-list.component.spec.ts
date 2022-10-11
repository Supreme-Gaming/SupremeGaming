import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaPlayerListComponent } from './ark-omega-player-list.component';

describe('ArkOmegaPlayerListComponent', () => {
  let component: ArkOmegaPlayerListComponent;
  let fixture: ComponentFixture<ArkOmegaPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaPlayerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
