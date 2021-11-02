import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkTribeSearchComponent } from './ark-tribe-search.component';

describe('ArkTribeSearchComponent', () => {
  let component: ArkTribeSearchComponent;
  let fixture: ComponentFixture<ArkTribeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkTribeSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkTribeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
