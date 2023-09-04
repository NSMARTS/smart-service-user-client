/**
 * Version 1.0
 * 파일명: sign-in.components.ts
 * 작성일시: 2023-08-21
 * 작성자: 임호균
 * 설명: 로그인 폼 구현
 * 
 * 수정일시: 2023-08-22
 * 수정자: 임호균
 * 설명: 로그인 기능 구현
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { NegativeDialogComponent } from 'src/app/components/dialog/negative-dialog/negative-dialog.component';
import { PositiveDialogComponent } from 'src/app/components/dialog/positive-dialog/positive-dialog.component';
import { ProgressDialogComponent } from 'src/app/components/dialog/progress-dialog/progress-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
interface FormData {
  email: FormControl;
  password: FormControl;
  isManager: FormControl;
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
    password: new FormControl('', [Validators.required]),
    isManager: new FormControl(false)
  })

  params: Params | undefined;

  

  constructor(public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private router: Router,private dialogService: DialogService) {
    // const dialogRef = this.dialog.open(ProgressDialogComponent);
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  /**
   * @수정자 임호균
   * @수정일 2023-08-25
   * @description 로그인 후 토큰 에러 발생하는 버그 해결
   * 
   * @수정자
   * @수정일 2023-09-04
   * @description 매니저 로그인 회원 로그인 분리
   */
  signIn() {
    console.log(this.signInForm.value)
    //매니저 로그인 분리
    if(this.signInForm.value.isManager){
      this.authService.managerSignIn(this.signInForm.value).subscribe({
        next: (res: any) => {
          if(this.params!['redirectURL'] != '' && this.params!['redirectURL'] != null && res.token != '' && res.token != null) {
            this.router.navigate([`${this.params!['redirectURL']}`])
          }
          else if(res.token != '' && res.token != null) {
            this.router.navigate(['main'])
          }
        },
        error: (e) => {
          // console.error(e)
          this.errorAlert(e.error.message)
        }
      })
    }else{
      this.authService.signIn(this.signInForm.value).subscribe({
        next: (res: any) => {
          if(this.params!['redirectURL'] != '' && this.params!['redirectURL'] != null && res.token != '' && res.token != null) {
            this.router.navigate([`${this.params!['redirectURL']}`])
          }
          else if(res.token != '' && res.token != null) {
            this.router.navigate(['main'])
          }
        },
        error: (e) => {
          // console.error(e)
          this.errorAlert(e.error.message)
        }
      })
    }
    
  }

  errorAlert(err: string) {
    this.dialogService.openDialogNegative(err)
  }
}
