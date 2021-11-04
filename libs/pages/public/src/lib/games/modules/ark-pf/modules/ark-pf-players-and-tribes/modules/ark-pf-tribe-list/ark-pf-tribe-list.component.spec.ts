import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfTribeListComponent } from './ark-pf-tribe-list.component';

describe('ArkPfTribeListComponent', () => {
  let component: ArkPfTribeListComponent;
  let fixture: ComponentFixture<ArkPfTribeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfTribeListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfTribeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
