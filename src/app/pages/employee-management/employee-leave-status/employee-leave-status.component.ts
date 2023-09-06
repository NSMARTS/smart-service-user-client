import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { LeaveService } from 'src/app/services/leave/leave.service';
import {Observable, map, merge, startWith, switchMap} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestManagerDetailsComponent } from 'src/app/components/dialog/leave-request-manager-details/leave-request-manager-details.component';

type NewType = MatPaginator;

interface FormData {
  leaveType: FormControl;
  leaveDay: FormControl;
  leaveStartDate: FormControl;
  leaveEndDate: FormControl;
  status: FormControl;
  email: FormControl;
}

@Component({
  selector: 'app-employee-leave-status',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule
  ],
  templateUrl: './employee-leave-status.component.html',
  styleUrls: ['./employee-leave-status.component.scss']
})
export class EmployeeLeaveStatusComponent implements AfterViewInit, OnInit{

  displayedColumns: string[] = ['createdAt', 'period', 'requestor','email', 'duration','year', 'day', 'type', 'status', 'button'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: NewType ;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup = new FormGroup<FormData>({
    leaveType: new FormControl(''),
    leaveDay: new FormControl(''),
    leaveStartDate: new FormControl<Date | null>(null),
    leaveEndDate: new FormControl<Date | null>(null),
    status: new FormControl('', ),
    email: new FormControl('')
  })


  constructor(private leaveService: LeaveService,
    public dialog: MatDialog,) {}

  ngOnInit(): void {}

  search() {
    this.getData();
  }

  ngAfterViewInit() {
    this.getData();
  }

  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.leaveService.getLeaveList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.searchForm.value.leaveType, this.searchForm.value.leaveDay, this.searchForm.value.leaveStartDate, this.searchForm.value.leaveEndDate, this.searchForm.value.status, this.searchForm.value.email.email ? this.searchForm.value.email.email : this.searchForm.value.email).pipe()
      }),
      map((data: any) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = data === null;

        this.options = data.emails;
        this.filteredOptions = this.searchForm.get('email')?.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.email;
            return name ? this._filter(name as string) : this.options.slice();
          }),
        );
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

  options: any = [];
  filteredOptions: Observable<any> | undefined;
  
  displayFn(user: any): string {
    return user && user.email ? user.email : '';
  }

  private _filter(name: any): any {
    const filterValue = name.toLowerCase();
    return this.options.filter((option: any) => option.email.toLowerCase().includes(filterValue));
  }



  openDialogPendingLeaveDetail(data: any) {
    const dialogRef = this.dialog.open(LeaveRequestManagerDetailsComponent, {
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
