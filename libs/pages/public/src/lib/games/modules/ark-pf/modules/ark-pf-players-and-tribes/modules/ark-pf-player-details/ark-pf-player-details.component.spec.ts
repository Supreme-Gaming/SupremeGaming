import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfPlayerDetailsComponent } from './ark-pf-player-details.component';

describe('ArkPfPlayerDetailsComponent', () => {
  let component: ArkPfPlayerDetailsComponent;
  let fixture: ComponentFixture<ArkPfPlayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfPlayerDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfPlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
