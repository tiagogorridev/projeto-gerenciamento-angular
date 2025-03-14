import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidebarComponent } from './admin-sidebar.component';

describe('SidebarComponent', () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSidebarComponent]
    });
    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
