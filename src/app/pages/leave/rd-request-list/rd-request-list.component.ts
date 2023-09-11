import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import * as moment from 'moment';
import { merge,map, startWith, switchMap } from 'rxjs';
import { ReplaceDayRequestDialogComponent } from 'src/app/components/dialog/replace-day-request-dialog/replace-day-request-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { LeaveService } from 'src/app/services/leave/leave.service';


@Component({
  selector: 'app-rd-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule
  ],
  templateUrl: './rd-request-list.component.html',
  styleUrls: ['./rd-request-list.component.scss']
})
export class RdRequestListComponent implements AfterViewInit {
  displayedColumns: string[] = ['period', 'manager','status','taken', 'Until', 'detail', 'request'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private leaveService: LeaveService,
    public dialog: MatDialog,

  ) {}

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
        return this.leaveService.replacementList(this.sort.active, this.sort.direction, this.paginator.pageIndex ).pipe()
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

        data.items.map((item: any) => {
          if(item.requestor?.personalLeave?.rdValidityTerm) {
            item.Until = moment(item.approveDay).add(item.requestor.personalLeave.rdValidityTerm, 'months'); 
          }
          
        })

        return data.items;
      }),
    )
    .subscribe(data => (this.data = data));
  }

  openDetailDialog(data: any) {
    const dialogRef = this.dialog.open(ReplaceDayRequestDialogComponent, {
      maxWidth: '600px',
      width : '100%',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result == 'success') {
        this.getData()
      }
    })
  }
}
