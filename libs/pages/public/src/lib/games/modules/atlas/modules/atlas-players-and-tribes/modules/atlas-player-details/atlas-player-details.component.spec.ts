import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasPlayerDetailsComponent } from './atlas-player-details.component';

describe('AtlasPlayerDetailsComponent', () => {
  let component: AtlasPlayerDetailsComponent;
  let fixture: ComponentFixture<AtlasPlayerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasPlayerDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasPlayerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
