import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaTribeListComponent } from './ark-omega-tribe-list.component';

describe('ArkOmegaTribeListComponent', () => {
  let component: ArkOmegaTribeListComponent;
  let fixture: ComponentFixture<ArkOmegaTribeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaTribeListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaTribeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
