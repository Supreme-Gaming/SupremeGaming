import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkTribesListComponent } from './ark-tribes-list.component';

describe('ArkTribesListComponent', () => {
  let component: ArkTribesListComponent;
  let fixture: ComponentFixture<ArkTribesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkTribesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkTribesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
