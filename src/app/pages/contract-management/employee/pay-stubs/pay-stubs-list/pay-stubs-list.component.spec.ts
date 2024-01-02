import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStubsListComponent } from './pay-stubs-list.component';

describe('PayStubsListComponent', () => {
  let component: PayStubsListComponent;
  let fixture: ComponentFixture<PayStubsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayStubsListComponent]
    });
    fixture = TestBed.createComponent(PayStubsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
