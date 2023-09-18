import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contract-detail-dialog',
  standalone: true,
  providers: [PdfViewerComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    PdfViewerModule
  ],
  templateUrl: './contract-detail-dialog.component.html',
  styleUrls: ['./contract-detail-dialog.component.scss']
})
export class ContractDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContractDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


}
