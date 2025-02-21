import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPageAdminComponent } from './help-page-admin.component';

describe('HelpPageAdminComponent', () => {
  let component: HelpPageAdminComponent;
  let fixture: ComponentFixture<HelpPageAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpPageAdminComponent]
    });
    fixture = TestBed.createComponent(HelpPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
