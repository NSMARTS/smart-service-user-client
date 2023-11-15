import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPayStubsListComponent } from './manager-pay-stubs-list.component';

describe('ManagerPayStubsListComponent', () => {
  let component: ManagerPayStubsListComponent;
  let fixture: ComponentFixture<ManagerPayStubsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerPayStubsListComponent]
    });
    fixture = TestBed.createComponent(ManagerPayStubsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
