import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractValidatorDialogComponent } from './contract-validator-dialog.component';

describe('ContractValidatorComponent', () => {
  let component: ContractValidatorDialogComponent;
  let fixture: ComponentFixture<ContractValidatorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContractValidatorDialogComponent]
    });
    fixture = TestBed.createComponent(ContractValidatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
