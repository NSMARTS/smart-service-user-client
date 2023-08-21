import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveStatusComponent } from './employee-leave-status.component';

describe('EmployeeLeaveStatusComponent', () => {
  let component: EmployeeLeaveStatusComponent;
  let fixture: ComponentFixture<EmployeeLeaveStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveStatusComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
