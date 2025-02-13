import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjetosComponent } from './admin-projetos.component';

describe('AdminProjetosComponent', () => {
  let component: AdminProjetosComponent;
  let fixture: ComponentFixture<AdminProjetosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProjetosComponent]
    });
    fixture = TestBed.createComponent(AdminProjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
