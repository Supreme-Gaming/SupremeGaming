import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySupportComponent } from './community-support.component';

describe('CommunitySupportComponent', () => {
  let component: CommunitySupportComponent;
  let fixture: ComponentFixture<CommunitySupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunitySupportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
