import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, switchMap } from 'rxjs';
import { ReplaceDayConfirmingRequestDialogComponent } from 'src/app/components/dialog/replace-day-confirming-request-dialog/replace-day-confirming-request-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { LeaveService } from 'src/app/services/leave/leave.service';
type NewType = MatPaginator;
@Component({
  selector: 'app-employee-rd-request',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './employee-rd-request.component.html',
  styleUrls: ['./employee-rd-request.component.scss']
})
export class EmployeeRdRequestComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'period', 'requestor', 'button'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: NewType;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaveService: LeaveService, public dialog: MatDialog,) { }
  ngAfterViewInit() {
    this.getData();
  }
  ngOnInit(): void { }


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
          return this.leaveService.replacementConfirmList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize).pipe()
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


  openDialogReplaceDayConfirmingRequestDetail(data: any) {
    const dialogRef = this.dialog.open(ReplaceDayConfirmingRequestDialogComponent, {
      maxWidth: '600px',
      width: '100%',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == 'success') {
        this.getData()
      }
    })
  }
}
