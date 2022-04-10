import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractResourceTableComponent } from './abstract-resource-table.component';

describe('AbstractResourceTableComponent', () => {
  let component: AbstractResourceTableComponent;
  let fixture: ComponentFixture<AbstractResourceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbstractResourceTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractResourceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
