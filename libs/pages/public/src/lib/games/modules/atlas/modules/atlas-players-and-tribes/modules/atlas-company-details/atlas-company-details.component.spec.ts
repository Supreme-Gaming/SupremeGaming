import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasCompanyDetailsComponent } from './atlas-company-details.component';

describe('AtlasCompanyDetailsComponent', () => {
  let component: AtlasCompanyDetailsComponent;
  let fixture: ComponentFixture<AtlasCompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlasCompanyDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
