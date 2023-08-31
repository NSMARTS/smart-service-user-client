import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MaterialsModule } from 'src/app/materials/materials.module';
import {MatNativeDateModule} from '@angular/material/core';
import { LeaveService } from 'src/app/services/leave/leave.service';

import {merge, Observable, of as observableOf, Subject} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface FormData {
  leaveType: FormControl;
  leaveDay: FormControl;
  leaveStartDate: FormControl;
  leaveEndDate: FormControl;
  status: FormControl;
}

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss']
})
export class LeaveRequestListComponent implements AfterViewInit{
  displayedColumns: string[] = ['createdAt', 'period','duration','year', 'day', 'type', 'status', 'button'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  @ViewChild(MatSort) sort!: MatSort;


  searchForm: FormGroup = new FormGroup<FormData>({
    leaveType: new FormControl(''),
    leaveDay: new FormControl(''),
    leaveStartDate: new FormControl<Date | null>(null),
    leaveEndDate: new FormControl<Date | null>(null),
    status: new FormControl('', )
  })


  constructor(
    private leaveService: LeaveService
  ) {}

  SearchRequest() {
    this.getData();
  }
  
  ngAfterViewInit() {
    this.getData()
  }

  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.leaveService.searchLeaves(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.searchForm.value.leaveType, this.searchForm.value.leaveDay,  this.searchForm.value.leaveStartDate, this.searchForm.value.leaveEndDate, this.searchForm.value.status).pipe()
      }),
      map((data: any) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;

        if (data === null) {
          return [];
        }

        // Only refresh the result length if there is new data. In case of rate
        // limit errors, we do not want to reset the paginator to zero, as that
        // would prevent users from re-triggering requests.
        this.resultsLength = data.total_count;
        return data.items;
      }),
    )
    .subscribe(data => (this.data = data));
  }
}
