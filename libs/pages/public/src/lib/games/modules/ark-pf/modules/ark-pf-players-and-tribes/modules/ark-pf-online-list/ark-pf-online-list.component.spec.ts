import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPfOnlineListComponent } from './ark-pf-online-list.component';

describe('ArkPfOnlineListComponent', () => {
  let component: ArkPfOnlineListComponent;
  let fixture: ComponentFixture<ArkPfOnlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPfOnlineListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPfOnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
