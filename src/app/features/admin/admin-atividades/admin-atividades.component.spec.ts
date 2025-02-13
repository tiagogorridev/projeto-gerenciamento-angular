import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAtividadesComponent } from './admin-atividades.component';

describe('AdminAtividadesComponent', () => {
  let component: AdminAtividadesComponent;
  let fixture: ComponentFixture<AdminAtividadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAtividadesComponent]
    });
    fixture = TestBed.createComponent(AdminAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
