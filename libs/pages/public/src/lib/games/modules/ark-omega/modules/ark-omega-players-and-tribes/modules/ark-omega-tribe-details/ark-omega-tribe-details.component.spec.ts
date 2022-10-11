import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaTribeDetailsComponent } from './ark-omega-tribe-details.component';

describe('ArkOmegaTribeDetailsComponent', () => {
  let component: ArkOmegaTribeDetailsComponent;
  let fixture: ComponentFixture<ArkOmegaTribeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaTribeDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaTribeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
