/**
 * Version 1.0
 * 파일명: sign-in.components.ts
 * 작성일시: 2023-08-21
 * 작성자: 임호균
 * 설명: 로그인 구현
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { NegativeDialogComponent } from 'src/app/components/dialog/negative-dialog/negative-dialog.component';
import { PositiveDialogComponent } from 'src/app/components/dialog/positive-dialog/positive-dialog.component';
import { ProgressDialogComponent } from 'src/app/components/dialog/progress-dialog/progress-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
interface FormData {
  email: FormControl;
  password: FormControl;
}
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    PositiveDialogComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup = new FormGroup<FormData>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(public dialog: MatDialog) {
    // const dialogRef = this.dialog.open(ProgressDialogComponent);

  }

  /**
   * 
   */
  signIn() {

  }
}
