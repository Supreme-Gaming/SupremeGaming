import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasOnlineListComponent } from './atlas-online-list.component';

describe('AtlasOnlineListComponent', () => {
  let component: AtlasOnlineListComponent;
  let fixture: ComponentFixture<AtlasOnlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasOnlineListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasOnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
