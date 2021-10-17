import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkOverviewComponent } from './ark-overview.component';

describe('ArkOverviewComponent', () => {
  let component: ArkOverviewComponent;
  let fixture: ComponentFixture<ArkOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
