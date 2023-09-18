import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, map, startWith, switchMap } from 'rxjs';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { EmployeeService } from 'src/app/services/employee/employee.service';
type NewType = MatPaginator;

interface FormData {
  username: FormControl;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'email', 'department', 'year', 'taken/Entitlement', 'taken/Rollover', 'taken/SickLeave', 'RD', 'tenure'];
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
    username: new FormControl('')
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
          return this.employeeService.employeeList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.searchForm.value.username).pipe()
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
}
