import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasCompanyListComponent } from './atlas-company-list.component';

describe('AtlasCompanyListComponent', () => {
  let component: AtlasCompanyListComponent;
  let fixture: ComponentFixture<AtlasCompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasCompanyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
