import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkComponent } from './ark.component';

describe('ArkComponent', () => {
  let component: ArkComponent;
  let fixture: ComponentFixture<ArkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
