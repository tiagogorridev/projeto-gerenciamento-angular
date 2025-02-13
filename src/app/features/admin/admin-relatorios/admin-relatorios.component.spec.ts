import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRelatoriosComponent } from './admin-relatorios.component';

describe('AdminRelatoriosComponent', () => {
  let component: AdminRelatoriosComponent;
  let fixture: ComponentFixture<AdminRelatoriosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRelatoriosComponent]
    });
    fixture = TestBed.createComponent(AdminRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
