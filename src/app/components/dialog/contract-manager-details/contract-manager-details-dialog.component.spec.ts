import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractManagerDetailsComponent } from './contract-manager-details-dialog.component';

describe('ContractManagerDetailsComponent', () => {
  let component: ContractManagerDetailsComponent;
  let fixture: ComponentFixture<ContractManagerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractManagerDetailsComponent]
    });
    fixture = TestBed.createComponent(ContractManagerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
