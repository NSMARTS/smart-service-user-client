import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import * as moment from 'moment';
import { ChangePasswordDialogComponent } from 'src/app/components/dialog/change-password-dialog/change-password-dialog.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';
interface FormData {
  password: FormControl;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  managers: any = [];
  employees: any = [];
  tenure: any;

  isManager: any;


  ConfirmForm: FormGroup = new FormGroup<FormData>({

    password: new FormControl('', [Validators.required]),

  })
  constructor(private employeeService: EmployeeService,
    private authService: AuthService,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.isManager = this.authService.getTokenInfo().isManager
    this.getData();
  }

  getData() {
    if (this.isManager) {
      this.employeeService.managerAbout().subscribe((res: any) => {

        this.profileData = res.managerInfo;
        this.employees = res.managersEmployee;
        this.getManagerProfileData();
      })
    } else {
      this.employeeService.about().subscribe((res: any) => {

        this.profileData = res.employeeInfo;
        this.managers = res.employeesManager;

        let tenure: any = (moment(new Date()).diff(moment(this.profileData.empStartDate), 'years', true));
        let tenureYear = Math.floor(tenure);
        let t: any = tenure % 1
        let tenureMonth = t.toFixed(1) * 10;

        this.tenure = `${tenureYear} Years ${tenureMonth} Months`
        this.getUserProfileData();
      })
    }
  }

  /**
   * 비밀번호 검증 함수
   */
  confirmPassword(): void {
    if (this.isManager) {
      //매니저라면 
      this.employeeService.confirmManagerPassword(this.ConfirmForm.value.password).subscribe((res: any) => {
        if (res.message == 'success') {
          this.dialog.open(ChangePasswordDialogComponent, {
            maxWidth: '400px',
            width: '100%',
            data: {
              isManager: this.isManager
            }
          })
        } else {
          this.dialogService.openDialogNegative('The password is incorrect. Please check again.')
        }
      })
    } else {
      //매니저가 아니라면
      this.employeeService.confirmPassword(this.ConfirmForm.value.password).subscribe((res: any) => {
        if (res.message == 'success') {
          this.dialog.open(ChangePasswordDialogComponent, {
            maxWidth: '400px',
            width: '100%',
            data: {
              isManager: this.isManager
            }
          })
        } else {
          this.dialogService.openDialogNegative('The password is incorrect. Please check again.')
        }
      })
    }
  }





  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (
        event.target.files[0].name.toLowerCase().endsWith('.jpg') ||
        event.target.files[0].name.toLowerCase().endsWith('.png')
      ) {
        // Image resize and update
        this.changeProfileImage(event.target.files[0]);
      } else {
        this.dialogService.openDialogNegative(
          'Profile photos are only available for PNG and JPG.'
        );
        // alert('프로필 사진은 PNG와 JPG만 가능합니다.');
      }
    } else {
      this.dialogService.openDialogNegative('Can not bring up pictures.');
      // alert('사진을 불러올 수 없습니다.');
    }
  }

  /**
   * @작성일 2023-09-14
   * @작성자 임호균
   * @description 사용자 프로필 이미지 변경 함수 
   * @param imgFile 
   */
  changeProfileImage(imgFile: File) {
    if (this.isManager) {
      //이미지를 바꾸려는 사용자가 매니저이면
      this.employeeService.changeManagerProfileImage(imgFile).subscribe((res: any) => {
        if (res.message == 'success') {
          this.getManagerProfileData();
          this.getData();
        }
      })
    } else {
      //이미지를 바꾸려는 사용자가 직원이면
      this.employeeService.changeEmployeeProfileImage(imgFile).subscribe((res: any) => {
        if (res.message == 'success') {
          this.getUserProfileData();
          this.getData();
        }
      })
    }
  }


  /**
   * @작성일 2023-09-14
   * @작성자 임호균
   * @description 사용자 프로필 이미지 초기화
   */
  resetProfileImage() {
    //이미지를 설정하기 전의 상태로 초기화
    if (this.isManager) {
      this.employeeService.resetManagerProfileImage().subscribe((res: any) => {
        if (res.message == 'success') {
          this.getManagerProfileData();
          this.getData();
        }
      })
    } else {
      this.employeeService.resetEmployeeProfileImage().subscribe((res: any) => {
        if (res.message == 'success') {
          this.getUserProfileData();
          this.getData();
        }
      })
    }
  }


  getUserProfileData() {
    this.profileService.getUserProfile().subscribe()
  }

  getManagerProfileData() {
    this.profileService.getManagerProfile().subscribe()
  }

}
