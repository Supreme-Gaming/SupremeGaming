import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerGridTileOverviewComponent } from './server-grid-tile-overview.component';

describe('ServerGridTileOverviewComponent', () => {
  let component: ServerGridTileOverviewComponent;
  let fixture: ComponentFixture<ServerGridTileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerGridTileOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerGridTileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
