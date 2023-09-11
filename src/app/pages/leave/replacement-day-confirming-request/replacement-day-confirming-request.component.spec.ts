import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementDayConfirmingRequestComponent } from './replacement-day-confirming-request.component';

describe('ReplacementDayConfirmingRequestComponent', () => {
  let component: ReplacementDayConfirmingRequestComponent;
  let fixture: ComponentFixture<ReplacementDayConfirmingRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplacementDayConfirmingRequestComponent]
    });
    fixture = TestBed.createComponent(ReplacementDayConfirmingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
