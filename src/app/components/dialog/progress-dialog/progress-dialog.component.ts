/**
 * Version 1.0
 * 파일명: progress.components.ts
 * 작성일시: 2023-08-21
 * 작성자: 임호균
 * 설명: progress 다이어로그
 */

import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialsModule } from 'src/app/materials/materials.module';

@Component({
  selector: 'app-progress-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
  ],
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements OnInit{
  flag: boolean | undefined;

  constructor(public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
    this.data.flag = true;
  }

  closeModal() {
    this.data.flag = false;
    this.dialogRef.close()
  }
}
