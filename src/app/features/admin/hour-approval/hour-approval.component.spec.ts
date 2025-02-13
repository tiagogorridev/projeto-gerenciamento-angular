import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourApprovalComponent } from './hour-approval.component';

describe('HourApprovalComponent', () => {
  let component: HourApprovalComponent;
  let fixture: ComponentFixture<HourApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HourApprovalComponent]
    });
    fixture = TestBed.createComponent(HourApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
