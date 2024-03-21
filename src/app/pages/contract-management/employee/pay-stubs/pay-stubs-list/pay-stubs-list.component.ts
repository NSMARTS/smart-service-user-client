import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
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
import { ContractValidatorDialogComponent } from 'src/app/components/dialog/contract-validator/contract-validator-dialog.component';
import { ContractDetailDialogComponent } from 'src/app/components/dialog/pay-stubs-detail-dialog/pay-stubs-detail-dialog.component';
import { Employee } from 'src/app/interfaces/employee.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DrawStoreService } from 'src/app/services/draw-store/draw-store.service';
interface FormData {
  updatedAt: FormControl;
  title: FormControl;
}
@Component({
  selector: 'app-pay-stubs-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule, MatNativeDateModule],

  templateUrl: './pay-stubs-list.component.html',
  styleUrls: ['./pay-stubs-list.component.scss'],
})
export class PayStubsListComponent implements AfterViewInit {
  // ----------서비스 주입-------------------
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  commonService = inject(CommonService);
  contractService = inject(ContractService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'updatedAt',
    'title',
    'writer',
    'status',
    'detail',
    'verify',
    'download',
  ];
  leaveDatabase: any | null;
  data: any = [];

  drawStoreService = inject(DrawStoreService);

  destroyRef = inject(DestroyRef);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  searchContractForm: FormGroup;
  companyId: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ---------- 시그널 변수 -----------------
  filteredEmployee = signal<any[]>([]); // 자동완성에 들어갈 emploeeList
  employees = signal<any[]>([]);

  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>(
    []
  );

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

  ngAfterViewInit(): void {
    this.searchRequest();
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
            .payStubsList(
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

                return res.items;
              })
            );
        })
      )
      .subscribe();
  }

  options: any = [];
  filteredOptions: Observable<any> | undefined;
  displayFn(user: any): string {
    return user && user.email ? user.email : '';
  }

  openDetailDialog(data: any) {
    this.drawStoreService.resetDrawingEvents();
    console.log(data);
    const dialogRef = this.dialog.open(ContractDetailDialogComponent, {
      maxWidth: '800px',
      width: '100%',
      data: {
        ...data,
        signMode: false,
        managerMode: false,
        disableClose: true,

      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.searchRequest();
      }
    });
  }

  openSignDialog(data: any) {
    const dialogRef = this.dialog.open(ContractDetailDialogComponent, {
      maxWidth: '800px',
      width: '100%',
      data: {
        ...data,
        signMode: true,
        disableClose: true,

      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.searchRequest();
      }
    });
  }
  openVerifyDialog(data: any) {
    const dialogRef = this.dialog.open(ContractValidatorDialogComponent, {
      width: '500px',
      //   height: '220px',
      data: {
        id: data._id,
        contractMod: false,
      },
      disableClose: true,

    });
  }

  handlePageEvent() {
    this.searchRequest();
  }
}
