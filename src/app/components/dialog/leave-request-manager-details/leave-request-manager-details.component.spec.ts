import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestManagerDetailsComponent } from './leave-request-manager-details.component';

describe('LeaveRequestManagerDetailsComponent', () => {
  let component: LeaveRequestManagerDetailsComponent;
  let fixture: ComponentFixture<LeaveRequestManagerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestManagerDetailsComponent]
    });
    fixture = TestBed.createComponent(LeaveRequestManagerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
