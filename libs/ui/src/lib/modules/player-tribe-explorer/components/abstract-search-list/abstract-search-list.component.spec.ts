import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractSearchListComponent } from './abstract-search-list.component';

describe('AbstractSearchListComponent', () => {
  let component: AbstractSearchListComponent;
  let fixture: ComponentFixture<AbstractSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbstractSearchListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
