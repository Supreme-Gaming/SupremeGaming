import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaPlayerDetailsComponent } from './ark-omega-player-details.component';

describe('ArkOmegaPlayerDetailsComponent', () => {
  let component: ArkOmegaPlayerDetailsComponent;
  let fixture: ComponentFixture<ArkOmegaPlayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaPlayerDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaPlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
