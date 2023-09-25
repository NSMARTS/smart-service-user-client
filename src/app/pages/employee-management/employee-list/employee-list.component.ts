import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _moment from 'moment';

import { merge, map, startWith, switchMap } from 'rxjs';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

const moment = _moment;

type NewType = MatPaginator;


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

interface FormData {
  username: FormControl;
  date: FormControl;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'email', 'department', 'year', 'taken/Entitlement', 'taken/SickLeave', 'taken/Rollover', 'RD', 'tenure'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: NewType;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService) { }
  ngOnInit() { }

  searchForm: FormGroup = new FormGroup<FormData>({
    username: new FormControl(''),
    date: new FormControl(moment())
  })

  ngAfterViewInit() {
    this.getData();
  }
  SearchRequest() {
    this.getData();
  }

  handlePageEvent() {
    this.getData();
  }
  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.employeeService.employeeList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.searchForm.value.username, this.searchForm.value.date).pipe()
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          return data.items;
        }),
      )
      .subscribe(data => (this.data = data));
  }



  //===============================================================
  setYear(normalizedYear: any, datepicker: MatDatepicker<moment.Moment>) {
    datepicker.close();
    this.searchForm.controls['date'].setValue(normalizedYear)
  }
}
