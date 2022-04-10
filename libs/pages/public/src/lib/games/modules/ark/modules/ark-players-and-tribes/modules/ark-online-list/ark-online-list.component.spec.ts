import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOnlineListComponent } from './ark-online-list.component';

describe('ArkOnlineListComponent', () => {
  let component: ArkOnlineListComponent;
  let fixture: ComponentFixture<ArkOnlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkOnlineListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
