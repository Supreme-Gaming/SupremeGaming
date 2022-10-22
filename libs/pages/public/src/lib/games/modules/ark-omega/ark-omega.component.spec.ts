import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaComponent } from './ark-omega.component';

describe('ArkOmegaComponent', () => {
  let component: ArkOmegaComponent;
  let fixture: ComponentFixture<ArkOmegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
