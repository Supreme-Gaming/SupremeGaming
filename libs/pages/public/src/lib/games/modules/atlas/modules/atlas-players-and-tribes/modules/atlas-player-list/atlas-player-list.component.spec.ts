import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPlayerListComponent } from './atlas-player-list.component';

describe('AtlasPlayerListComponent', () => {
  let component: AtlasPlayerListComponent;
  let fixture: ComponentFixture<AtlasPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasPlayerListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
