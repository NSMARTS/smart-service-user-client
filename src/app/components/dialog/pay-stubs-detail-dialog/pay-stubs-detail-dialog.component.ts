import { DrawStoreService } from './../../../services/draw-store/draw-store.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PayStubsSignDialogComponent } from '../pay-stubs-sign-dialog/pay-stubs-sign-dialog.component';

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
  constructor(
    public dialogRef: MatDialogRef<ContractDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data)
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
