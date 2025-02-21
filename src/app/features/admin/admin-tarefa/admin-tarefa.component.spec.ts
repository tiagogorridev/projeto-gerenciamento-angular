import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTarefaComponent } from './admin-tarefa.component';

describe('AdminTarefaComponent', () => {
  let component: AdminTarefaComponent;
  let fixture: ComponentFixture<AdminTarefaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTarefaComponent]
    });
    fixture = TestBed.createComponent(AdminTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
