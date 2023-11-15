import { Component, DestroyRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { Employee } from 'src/app/interfaces/employee.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent {
  // ----------서비스 주입-------------------
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  commonService = inject(CommonService);
  contractService = inject(ContractService);
  dialogService = inject(DialogService);

  // ---------- 변수 선언 ------------------
  searchContractForm: FormGroup;
  companyId: string;
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  destroyRef = inject(DestroyRef);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'uploadDate',
    'title',
    'writer',
    'employeeName',
    'employeeStatus',
    'managerName',
    'managerStatus',
    'download',
    'detail',
    'menu',
  ];
  resultsLength = 0;

  // ---------- 시그널 변수 -----------------
  filteredEmployee = signal<any[]>([]); // 자동완성에 들어갈 emploeeList
  employees = signal<any[]>([]);

  constructor() {
    this.companyId = this.route.snapshot.params['id'];

    // 이번 달 기준 첫째날
    const startOfMonth = moment().startOf('month').format();
    // 이번 달 기준 마지막날
    const endOfMonth = moment().endOf('month').format();

    this.searchContractForm = this.fb.group({
      titleFormControl: new FormControl(''),
      emailFormControl: new FormControl(''),
      uploadStartDate: new FormControl(startOfMonth),
      uploadEndDate: new FormControl(endOfMonth),
    })
  }
  ngAfterViewInit(): void {
    // this.getData()
  }


  getContractsByQuery() {

  }

  detail(_id: string) {

  }

  download(key: string) {

  }

  editContract(_id: string) {

  }

  deleteContract(_id: string) {

  }
}
