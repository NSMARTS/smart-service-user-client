import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, switchMap } from 'rxjs';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { LeaveService } from 'src/app/services/leave/leave.service';

@Component({
  selector: 'app-my-status',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './my-status.component.html',
  styleUrls: ['./my-status.component.scss']
})
export class MyStatusComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['createdAt', 'period', 'year', 'day', 'type', 'status'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  annualLeave: any;
  rollover: any;
  sickLeave: any;
  replacementLeave: any;

  isStatusLoading = true;

  isReplacementDay = false;
  isRollover = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getData()
  }

  handlePageEvent() {
    this.getData()
  }

  constructor(private leaveService: LeaveService) {

  }

  ngOnInit() {
    this.isStatusLoading = true;
    this.leaveService.leaveInformationForStatus().subscribe((res: any) => {
      this.annualLeave = res.AnnualLeave,
        this.rollover = res.Rollover,
        this.sickLeave = res.SickLeave,
        this.isRollover = res.isRollover,
        this.isReplacementDay = res.isReplacementDay,
        this.replacementLeave = res.Replacement
      this.isStatusLoading = false;
    })
  }

  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.leaveService.searchLeavesThreeMonth(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize).pipe()
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
