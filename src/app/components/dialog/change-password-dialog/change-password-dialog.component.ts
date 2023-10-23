import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { confirmPasswordValidator } from './confirm-password.validator';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
interface FormData {
  password: FormControl;
  confirmPassword: FormControl;
}
@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent implements OnInit {
  isEqual: boolean = true;

  passwordForm: FormGroup = new FormGroup<FormData>(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: confirmPasswordValidator }
  );

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private dialogService: DialogService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      if (answer) {
        if (this.data.isManager) {
          //비밀번호를 바꾸려는 사람이 매니저이면
          this.employeeService
            .changeManagerPassword(this.passwordForm.value.password)
            .subscribe((res: any) => {
              if (res.message == 'success') {
                this.dialogService
                  .openDialogPositive(
                    'Password change succeeded. Please log in again.'
                  )
                  .subscribe(() => {
                    this.authService.signOut();
                    this.router.navigate(['sign-in']);
                    this.dialogRef.close();
                  });
              }
            });
        } else {
          //아니면
          this.employeeService
            .changePassword(this.passwordForm.value.password)
            .subscribe((res: any) => {
              if (res.message == 'success') {
                this.dialogService
                  .openDialogPositive(
                    'Password change succeeded. Please log in again.'
                  )
                  .subscribe(() => {
                    this.authService.signOut();
                    this.router.navigate(['sign-in']);
                    this.dialogRef.close();
                  });
              }
            });
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
