import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaployeeLeaveStatusComponent } from './emaployee-leave-status.component';

describe('EmaployeeLeaveStatusComponent', () => {
  let component: EmaployeeLeaveStatusComponent;
  let fixture: ComponentFixture<EmaployeeLeaveStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmaployeeLeaveStatusComponent]
    });
    fixture = TestBed.createComponent(EmaployeeLeaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
