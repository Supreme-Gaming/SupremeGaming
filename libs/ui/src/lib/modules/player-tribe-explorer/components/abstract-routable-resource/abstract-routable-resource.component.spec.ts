import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractRoutableResourceComponent } from './abstract-routable-resource.component';

describe('AbstractRoutableResourceComponent', () => {
  let component: AbstractRoutableResourceComponent;
  let fixture: ComponentFixture<AbstractRoutableResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbstractRoutableResourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractRoutableResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
