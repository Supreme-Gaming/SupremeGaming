import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfComponent } from './ark-pf.component';

describe('ArkPfComponent', () => {
  let component: ArkPfComponent;
  let fixture: ComponentFixture<ArkPfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
