import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkTribeDetailsComponent } from './ark-tribe-details.component';

describe('ArkTribeDetailsComponent', () => {
  let component: ArkTribeDetailsComponent;
  let fixture: ComponentFixture<ArkTribeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkTribeDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkTribeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
