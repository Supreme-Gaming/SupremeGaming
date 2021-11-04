import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfPlayerListComponent } from './ark-pf-player-list.component';

describe('ArkPfPlayerListComponent', () => {
  let component: ArkPfPlayerListComponent;
  let fixture: ComponentFixture<ArkPfPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfPlayerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
