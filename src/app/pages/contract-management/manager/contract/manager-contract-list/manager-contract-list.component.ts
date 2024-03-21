import {
  Component,
  DestroyRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/interfaces/employee.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ContractValidatorDialogComponent } from 'src/app/components/dialog/contract-validator/contract-validator-dialog.component';

@Component({
  selector: 'app-manager-contract-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  templateUrl: './manager-contract-list.component.html',
  styleUrls: ['./manager-contract-list.component.scss'],
})
export class ManagerContractListComponent {
  // ----------서비스 주입-------------------
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  commonService = inject(CommonService);
  contractService = inject(ContractService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog);

  // ---------- 변수 선언 ------------------
  searchContractForm: FormGroup;
  companyId: string;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pdfUrl: string | null = null;

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>(
    []
  );
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
    'menu',
  ];

  data: any = [];

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
    });
  }
  ngAfterViewInit() {
    this.searchRequest();
  }
  ngOnDestroy() {
    // 컴포넌트가 파괴될 때 Blob URL 해제, 안하면 다운로드한 pdf가 브라우저 메모리를 잡아먹는다.
    // console.log('메모리 초기화')
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }
  }
  searchRequest() {
    const formValue = this.searchContractForm.value;
    const convertedContractStartDate = this.commonService.dateFormatting(
      this.searchContractForm.controls['uploadStartDate'].value
    );
    // 검색 범위 마지막 일을 YYYY-MM-DD 포맷으로 변경
    const convertedContractEndDate = this.commonService.dateFormatting(
      this.searchContractForm.controls['uploadEndDate'].value
    );
    // 조건에 따른 사원들 휴가 가져오기
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.contractService
            .getManagerContractList(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize,
              convertedContractStartDate,
              convertedContractEndDate,
              formValue.titleFormControl,
              formValue.emailFormControl
            )
            .pipe(
              map((res: any) => {
                // Flip flag to show that loading has finished.
                //   this.isRateLimitReached = res.data === null;
                console.log(res);
                this.isLoadingResults = false;
                this.resultsLength = res.total_count;
                this.dataSource = new MatTableDataSource<any>(res.items);

                this.employees.set(res.emails);
                this.searchContractForm.controls[
                  'emailFormControl'
                ].valueChanges
                  .pipe(
                    startWith(''),
                    map((employee) =>
                      employee
                        ? this._filterStates(employee)
                        : this.employees().slice()
                    ),
                    // 배열로 가져온거 시그널에 등록
                    map((employees) => this.filteredEmployee.set(employees)),
                    takeUntilDestroyed(this.destroyRef)
                  )
                  .subscribe();

                return res.items;
              })
            );
        })
      )
      .subscribe();
  }

  private _filterStates(email: string): Employee[] {
    const filterValue = email.toLowerCase();
    return this.employees().filter(
      (state) =>
        state.email.toLowerCase().includes(filterValue) ||
        state.username.toLowerCase().includes(filterValue)
    );
  }

  handleContractDetailClick(_id: string) {
    this.router.navigate([
      `contract-management/manager-contract/detail/${_id}`,
    ]);
  }

  handleContractDownloadClick(key: string) {
    this.contractService.downloadContract(key).subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.pdfUrl = window.URL.createObjectURL(blob);
        window.open(this.pdfUrl);
      },
      error: (error) => {
        console.error(error);
        this.dialogService.openDialogNegative('Internet Server Error.');
      },
    });
  }

  handleContractSignClick(_id: string) {
    this.router.navigate([`contract-management/manager-contract/sign/${_id}`]);
  }

  handleContractValidateClick(_id: string) {
    const dialogRef = this.dialog.open(ContractValidatorDialogComponent, {
      width: '500px',
      //   height: '220px',
      data: {
        id: _id,
        contractMod: true,
      },
      disableClose: true,

    });
  }
  openDetailDialog(row: any) { }

  handlePageEvent() { }
}
