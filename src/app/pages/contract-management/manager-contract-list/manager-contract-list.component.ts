import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, map, merge, startWith, switchMap } from 'rxjs';
import { ContractDetailDialogComponent } from 'src/app/components/dialog/contract-detail-dialog/contract-detail-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ContractService } from 'src/app/services/contract/contract.service';
interface FormData {
  updatedAt: FormControl;
  title: FormControl;
  email: FormControl;
}
@Component({
  selector: 'app-manager-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
  ],
  templateUrl: './manager-contract-list.component.html',
  styleUrls: ['./manager-contract-list.component.scss']
})
export class ManagerContractListComponent implements AfterViewInit {
  displayedColumns: string[] = ['updatedAt', 'title', 'writer', 'employee', 'email', 'detail', 'download'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private contractService: ContractService, public dialog: MatDialog) { }

  searchForm: FormGroup = new FormGroup<FormData>({
    updatedAt: new FormControl<Date | null>(null),
    title: new FormControl('',),
    email: new FormControl('',)
  })

  ngAfterViewInit(): void {
    this.getData()
  }

  SearchRequest() {
    this.getData();
  }

  getData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    console.log(this.searchForm.value)
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.contractService.managerContractList(this.sort.active, this.sort.direction, this.paginator.pageIndex,
            this.searchForm.value.updatedAt, this.searchForm.value.title, this.searchForm.value.email._id
          ).pipe()
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



  openDetailDialog(data: any) {
    const dialogRef = this.dialog.open(ContractDetailDialogComponent, {
      maxWidth: '800px',
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
