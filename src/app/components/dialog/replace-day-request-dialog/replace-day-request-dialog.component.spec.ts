import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceDayRequestDialogComponent } from './replace-day-request-dialog.component';

describe('ReplaceDayRequestDialogComponent', () => {
  let component: ReplaceDayRequestDialogComponent;
  let fixture: ComponentFixture<ReplaceDayRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReplaceDayRequestDialogComponent]
    });
    fixture = TestBed.createComponent(ReplaceDayRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
