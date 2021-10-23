import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerGridListComponent } from './server-grid-list.component';

describe('ServerGridListComponent', () => {
  let component: ServerGridListComponent;
  let fixture: ComponentFixture<ServerGridListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerGridListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
