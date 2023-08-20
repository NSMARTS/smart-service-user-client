import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRdRequestComponent } from './employee-rd-request.component';

describe('EmployeeRdRequestComponent', () => {
  let component: EmployeeRdRequestComponent;
  let fixture: ComponentFixture<EmployeeRdRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeRdRequestComponent]
    });
    fixture = TestBed.createComponent(EmployeeRdRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
