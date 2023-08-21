/**
 * Version 1.0
 * 파일명: dialog.service.ts
 * 작성일시: 2023-08-21
 * 작성자: 임호균
 * 설명: 다이어로그 서비스
 */

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { NegativeDialogComponent } from 'src/app/components/dialog/negative-dialog/negative-dialog.component';
import { PositiveDialogComponent } from 'src/app/components/dialog/positive-dialog/positive-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog,
  ) { }

  /**
   * @description 컨펌 다이어로그 열기 
   * @param data 다이어로그에 포함할 문자
   * @returns dialogRef.afterClosed()
   */
  openDialogConfirm(data: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: data
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * @description 긍정 다이어로그 열기 
   * @param data 다이어로그에 포함할 문자
   * @returns dialogRef.afterClosed()
   */
  openDialogPositive(data: string) {
    const dialogRef = this.dialog.open(PositiveDialogComponent, {
      data: {
         content: data
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * @description 부정 다이어로그 열기 
   * @param data 다이어로그에 포함할 문자
   * @returns dialogRef.afterClosed()
   */
  openDialogNegative(data: string) {
    const dialogRef = this.dialog.open(NegativeDialogComponent, {
      data: {
        content: data
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * @description 로딩 다이어로그 열기 
   * @returns dialogRef.afterClosed()
   */
  openDialogProgress() {
    const dialogRef = this.dialog.open(ProcessingInstruction)

    return dialogRef.afterClosed();
  }
}