import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { map, merge, startWith, switchMap } from 'rxjs';
import { NotificationDetailsDialogComponent } from 'src/app/components/dialog/notification-details-dialog/notification-details-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
interface FormData {
  title: FormControl;
  category: FormControl;
}
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements AfterViewInit {
  displayedColumns: string[] = ['updatedAt', 'title', 'category', 'writer', 'detail'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isManager: boolean = false;

  constructor(private notificationService: NotificationService
    , private authService: AuthService
    , public dialog: MatDialog) {
    this.isManager = this.authService.getTokenInfo().isManager;
  }
  searchForm: FormGroup = new FormGroup<FormData>({
    title: new FormControl('',),
    category: new FormControl('',)
  })

  SearchRequest() {
    this.getData();
  }
  ngAfterViewInit() {
    this.getData()
  }
  handlePageEvent() {
    this.getData()
  }

  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.notificationService.findNotifications(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.isManager, this.searchForm.value.title, this.searchForm.value.category).pipe()
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


  openDetailDialog(data: any) {
    const dialogRef = this.dialog.open(NotificationDetailsDialogComponent, {
      maxWidth: '1300px',
      width: '100%',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.getData()
      }
    })
  }
}
