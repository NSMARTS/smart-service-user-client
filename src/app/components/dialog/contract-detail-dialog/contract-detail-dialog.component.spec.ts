import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDetailDialogComponent } from './contract-detail-dialog.component';

describe('ContractDetailDialogComponent', () => {
  let component: ContractDetailDialogComponent;
  let fixture: ComponentFixture<ContractDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractDetailDialogComponent]
    });
    fixture = TestBed.createComponent(ContractDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});