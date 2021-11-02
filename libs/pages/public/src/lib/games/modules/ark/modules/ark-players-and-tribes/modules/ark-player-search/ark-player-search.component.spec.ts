import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkPlayerSearchComponent } from './ark-player-search.component';

describe('ArkPlayerSearchComponent', () => {
  let component: ArkPlayerSearchComponent;
  let fixture: ComponentFixture<ArkPlayerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkPlayerSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkPlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
