import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersOnlinePlayerListComponent } from './servers-online-player-list.component';

describe('ServersOnlinePlayerListComponent', () => {
  let component: ServersOnlinePlayerListComponent;
  let fixture: ComponentFixture<ServersOnlinePlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServersOnlinePlayerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServersOnlinePlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
