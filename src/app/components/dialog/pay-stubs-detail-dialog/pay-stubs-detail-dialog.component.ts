import { DialogService } from 'src/app/services/dialog/dialog.service';
import { map } from 'rxjs';
import { DrawStoreService } from './../../../services/draw-store/draw-store.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PayStubsSignDialogComponent } from '../pay-stubs-sign-dialog/pay-stubs-sign-dialog.component';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-pay-stubs-detail-dialog',
  standalone: true,
  providers: [PdfViewerComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    PdfViewerModule
  ],
  templateUrl: './pay-stubs-detail-dialog.component.html',
  styleUrls: ['./pay-stubs-detail-dialog.component.scss']
})
export class ContractDetailDialogComponent {
  dialog = inject(MatDialog)
  drawStoreService = inject(DrawStoreService)
  dialogService = inject(DialogService)
  contractService = inject(ContractService)
  isLoadingResults = true;
  constructor(
    public dialogRef: MatDialogRef<ContractDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data)
    if (!this.data.managerMode) {
      this.contractService.getPayStubById(this.data._id).subscribe({
        next: (res: any) => {
          this.isLoadingResults = false;
        },
        error: (error: any) => {
          this.isLoadingResults = false;
          this.dialogService.openDialogNegative(error.error.message)
          this.dialogRef.close('success')
        }
      })
    } else if (this.data.managerMode) {
      this.contractService.getManagerPayStubById(this.data._id, this.data.employee._id).subscribe({
        next: (res: any) => {
          this.isLoadingResults = false;
        },
        error: (error: any) => {
          this.isLoadingResults = false;
          this.dialogService.openDialogNegative(error.error.message)
          this.dialogRef.close('success')
        }
      })
    }

  }
  openSignDialog() {
    const dialogRef = this.dialog.open(PayStubsSignDialogComponent, {
      data: {
        ...this.data
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.drawStoreService.resetDrawingEvents()
      if (res === 'successSign') {
        this.dialogRef.close('success')
      }
    })
  }

}
