import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerContractListComponent } from './manager-contract-list.component';

describe('ManagerContractListComponent', () => {
  let component: ManagerContractListComponent;
  let fixture: ComponentFixture<ManagerContractListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManagerContractListComponent]
    });
    fixture = TestBed.createComponent(ManagerContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
