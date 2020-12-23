import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFragmentComponent } from './content-fragment.component';

describe('ContentFragmentComponent', () => {
  let component: ContentFragmentComponent;
  let fixture: ComponentFixture<ContentFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentFragmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
