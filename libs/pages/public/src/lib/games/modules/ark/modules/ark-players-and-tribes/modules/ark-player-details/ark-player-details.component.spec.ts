import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPlayerDetailsComponent } from './ark-player-details.component';

describe('ArkPlayerDetailsComponent', () => {
  let component: ArkPlayerDetailsComponent;
  let fixture: ComponentFixture<ArkPlayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPlayerDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
