import { DrawStoreService } from './../../../../../services/draw-store/draw-store.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, map, merge, startWith, switchMap } from 'rxjs';
import { ContractDetailDialogComponent } from 'src/app/components/dialog/pay-stubs-detail-dialog/pay-stubs-detail-dialog.component';
import { Employee } from 'src/app/interfaces/employee.interface';

import { MaterialsModule } from 'src/app/materials/materials.module';
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
interface FormData {
  updatedAt: FormControl;
  title: FormControl;
  email: FormControl;
}
@Component({
  selector: 'app-manager-pay-stubs-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
  ],
  templateUrl: './manager-pay-stubs-list.component.html',
  styleUrls: ['./manager-pay-stubs-list.component.scss']
})
export class ManagerPayStubsListComponent implements AfterViewInit {

  // ----------서비스 주입-------------------
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  commonService = inject(CommonService);
  contractService = inject(ContractService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog)

  displayedColumns: string[] = ['updatedAt', 'title', 'writer', 'employee', 'email', 'detail', 'download'];
  leaveDatabase: any | null;
  data: any = [];
  searchContractForm: FormGroup;
  companyId: string;

  drawStoreService = inject(DrawStoreService)

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;



  // ---------- 시그널 변수 -----------------
  filteredEmployee = signal<any[]>([]); // 자동완성에 들어갈 emploeeList
  employees = signal<any[]>([]);
  destroyRef = inject(DestroyRef);

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
  ) {

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
    this.searchRequest()
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
          return this.contractService.managerPayStubList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            convertedContractStartDate,
            convertedContractEndDate,
            formValue.titleFormControl,
            formValue.emailFormControl,
          ).pipe(
            map((res: any) => {
              // Flip flag to show that loading has finished.
              //   this.isRateLimitReached = res.data === null;
              console.log(res);
              this.isLoadingResults = false;
              this.resultsLength = res.total_count;
              this.dataSource = new MatTableDataSource<any>(res.items);

              this.employees.set(res.emails);
              this.searchContractForm.controls['emailFormControl'].valueChanges
                .pipe(
                  startWith(''),
                  map((employee) =>
                    employee ? this._filterStates(employee) : this.employees().slice()
                  ),
                  // 배열로 가져온거 시그널에 등록
                  map((employees) => this.filteredEmployee.set(employees)),
                  takeUntilDestroyed(this.destroyRef)
                )
                .subscribe();

              return res.items;
            })
          );
        }),
      ).subscribe();
  }

  private _filterStates(email: string): Employee[] {
    const filterValue = email.toLowerCase();
    return this.employees().filter(
      (state) =>
        state.email.toLowerCase().includes(filterValue) ||
        state.username.toLowerCase().includes(filterValue)
    );
  }


  options: any = [];
  filteredOptions: Observable<any> | undefined;
  displayFn(user: any): string {
    return user && user.email ? user.email : '';
  }

  private _filter(name: any): any {
    const filterValue = name.toLowerCase();
    return this.options.filter((option: any) => option.email.toLowerCase().includes(filterValue));
  }



  openDetailDialog(data: any) {
    this.drawStoreService.resetDrawingEvents()
    const dialogRef = this.dialog.open(ContractDetailDialogComponent, {
      maxWidth: '800px',
      width: '100%',
      data: {
        ...data,
        managerMode: true,
        disableClose: true,

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.searchRequest()
      }
    })
  }

  handlePageEvent() {
    this.searchRequest()
  }
}
