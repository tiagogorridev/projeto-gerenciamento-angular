import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRelatoriosComponent } from './users-relatorios.component';

describe('UsersRelatoriosComponent', () => {
  let component: UsersRelatoriosComponent;
  let fixture: ComponentFixture<UsersRelatoriosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersRelatoriosComponent]
    });
    fixture = TestBed.createComponent(UsersRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
