import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceDayConfirmingRequestDialogComponent } from './replace-day-confirming-request-dialog.component';

describe('ReplaceDayConfirmingRequestDialogComponent', () => {
  let component: ReplaceDayConfirmingRequestDialogComponent;
  let fixture: ComponentFixture<ReplaceDayConfirmingRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplaceDayConfirmingRequestDialogComponent]
    });
    fixture = TestBed.createComponent(ReplaceDayConfirmingRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
