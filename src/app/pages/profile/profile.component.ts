import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ChangePasswordDialogComponent } from 'src/app/components/dialog/change-password-dialog/change-password-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
interface FormData {
  password: FormControl;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  profileData: any = {};
  managers : any = [];
  employees : any = [];
  tenure: any;
  
  isManager: any;


  ConfirmForm: FormGroup = new FormGroup<FormData>({

    password: new FormControl('', [Validators.required]),

  })
  constructor(private employeeService: EmployeeService,
    private authService: AuthService,
    private dialogService: DialogService,
    public dialog: MatDialog,) {}

  ngOnInit(): void {
    this.isManager = this.authService.getTokenInfo().isManager
    if(this.isManager) {
      this.employeeService.managerAbout().subscribe((res: any) => {

        this.profileData = res.managerInfo;
        this.employees = res.managersEmployee;

      })  
    }else{
      this.employeeService.about().subscribe((res: any) => {

        this.profileData = res.employeeInfo;
        this.managers = res.employeesManager;

        let tenure : any= (moment(new Date()).diff(moment(this.profileData.empStartDate), 'years', true));
        let tenureYear = Math.floor(tenure);
        let t: any = tenure % 1
        let tenureMonth = t.toFixed(1) * 10;

        this.tenure =  `${tenureYear} Years ${tenureMonth} Months`
      })  
    }
  }

  /**
   * 비밀번호 검증 함수
   */
  confirmPassword(): void {
    if(this.isManager) {
      //매니저라면 
      this.employeeService.confirmManagerPassword(this.ConfirmForm.value.password).subscribe((res: any) => {
        if(res.message == 'success'){
          const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            maxWidth: '400px',
            width : '100%',
            data: {
              isManager: this.isManager
            }
          })

          dialogRef.afterClosed().subscribe(result => {
            if(result == 'success') {
              //여기서 로그아웃 시키고 다시 로그인 시키기
            }
          })
        }else{
          this.dialogService.openDialogNegative('The password is incorrect. Please check again.')
        }
      })
    }else {
      //매니저가 아니라면
      this.employeeService.confirmPassword(this.ConfirmForm.value.password).subscribe((res: any) => {
        if(res.message == 'success'){
          const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            maxWidth: '400px',
            width : '100%',
            data: {
              isManager: this.isManager
            }
          })

          dialogRef.afterClosed().subscribe(result => {
            if(result == 'success') {
              //여기서 로그아웃 시키고 다시 로그인 시키기
            }
          })
        }else{
          this.dialogService.openDialogNegative('The password is incorrect. Please check again.')
        }
      })
    }
  }
}
