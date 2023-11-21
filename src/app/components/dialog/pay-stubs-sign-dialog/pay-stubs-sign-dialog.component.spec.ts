import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStubsSignDialogComponent } from './pay-stubs-sign-dialog.component';

describe('PayStubsSignDialogComponent', () => {
  let component: PayStubsSignDialogComponent;
  let fixture: ComponentFixture<PayStubsSignDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayStubsSignDialogComponent]
    });
    fixture = TestBed.createComponent(PayStubsSignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
