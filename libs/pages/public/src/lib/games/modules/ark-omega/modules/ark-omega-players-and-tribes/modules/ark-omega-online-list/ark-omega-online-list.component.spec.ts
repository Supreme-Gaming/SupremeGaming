import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOmegaOnlineListComponent } from './ark-omega-online-list.component';

describe('ArkOmegaOnlineListComponent', () => {
  let component: ArkOmegaOnlineListComponent;
  let fixture: ComponentFixture<ArkOmegaOnlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOmegaOnlineListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOmegaOnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
