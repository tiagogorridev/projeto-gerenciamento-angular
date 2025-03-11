import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarClienteComponent } from './adicionar-cliente.component';

describe('AdicionarClienteComponent', () => {
  let component: AdicionarClienteComponent;
  let fixture: ComponentFixture<AdicionarClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdicionarClienteComponent]
    });
    fixture = TestBed.createComponent(AdicionarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
