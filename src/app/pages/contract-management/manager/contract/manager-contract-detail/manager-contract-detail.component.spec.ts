import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerContractDetailComponent } from './manager-contract-detail.component';

describe('ManagerContractDetailComponent', () => {
  let component: ManagerContractDetailComponent;
  let fixture: ComponentFixture<ManagerContractDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManagerContractDetailComponent]
    });
    fixture = TestBed.createComponent(ManagerContractDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
