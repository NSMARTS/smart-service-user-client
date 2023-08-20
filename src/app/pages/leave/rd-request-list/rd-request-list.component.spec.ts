import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdRequestListComponent } from './rd-request-list.component';

describe('RdRequestListComponent', () => {
  let component: RdRequestListComponent;
  let fixture: ComponentFixture<RdRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdRequestListComponent]
    });
    fixture = TestBed.createComponent(RdRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
