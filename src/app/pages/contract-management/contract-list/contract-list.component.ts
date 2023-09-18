import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, switchMap } from 'rxjs';
import { ContractDetailDialogComponent } from 'src/app/components/dialog/contract-detail-dialog/contract-detail-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ContractService } from 'src/app/services/contract/contract.service';
interface FormData {
  updatedAt: FormControl;
  title: FormControl;
}
@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
  ],

  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements AfterViewInit {
  displayedColumns: string[] = ['updatedAt', 'title', 'writer', 'detail', 'download'];
  leaveDatabase: any | null;
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private contractService: ContractService, public dialog: MatDialog) {

  }
  searchForm: FormGroup = new FormGroup<FormData>({
    updatedAt: new FormControl<Date | null>(null),
    title: new FormControl(''),
  })

  ngAfterViewInit(): void {
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
          return this.contractService.contractList(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
            this.searchForm.value.updatedAt, this.searchForm.value.title).pipe()
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
