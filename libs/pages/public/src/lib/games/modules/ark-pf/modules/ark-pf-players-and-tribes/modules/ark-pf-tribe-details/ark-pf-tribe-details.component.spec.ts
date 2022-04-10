import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfTribeDetailsComponent } from './ark-pf-tribe-details.component';

describe('ArkPfTribeDetailsComponent', () => {
  let component: ArkPfTribeDetailsComponent;
  let fixture: ComponentFixture<ArkPfTribeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfTribeDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfTribeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
