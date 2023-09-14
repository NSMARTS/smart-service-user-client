import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import * as moment from 'moment';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
interface EmployeeFormData {
  username: FormControl,
  department: FormControl
}

interface ManagerFormData {
  username: FormControl,
  phoneNumber: FormControl,
  address: FormControl
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, MaterialsModule, RouterModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent {
  profileData: any = {};
  managers: any = [];
  employees: any = [];

  isManager: any;

  // 직원 폼 데이터
  employeeForm: FormGroup = new FormGroup<EmployeeFormData>({
    username: new FormControl('', [Validators.required]),
    department: new FormControl('')
  })

  // 매니저 폼 데이터 
  managerForm: FormGroup = new FormGroup<ManagerFormData>({
    username: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
    address: new FormControl('')
  })


  constructor(private employeeService: EmployeeService,
    private authService: AuthService,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.isManager = this.authService.getTokenInfo().isManager
    if (this.isManager) {
      this.employeeService.managerAbout().subscribe((res: any) => {

        this.profileData = res.managerInfo;
        this.employees = res.managersEmployee;

        this.managerForm.setValue({
          username: this.profileData.username,
          phoneNumber: this.profileData.phoneNumber,
          address: this.profileData.address
        })
      })
    } else {
      this.employeeService.about().subscribe((res: any) => {

        this.profileData = res.employeeInfo;
        this.managers = res.employeesManager;


        this.employeeForm.setValue({
          username: this.profileData.username,
          department: this.profileData.department
        })
      })
    }
  }


  employeeSubmit() {
    this.employeeService.changeEmployeeInfo(this.employeeForm.value).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') [
        this.dialogService.openDialogPositive('Profile change succeeded.').subscribe(() => {
          this.router.navigate(['profile'])
        })
      ]
    })
  }


  managerSubmit() {
    this.employeeService.changeMangerInfo(this.managerForm.value).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this.dialogService.openDialogPositive('Profile change succeeded.').subscribe(() => {
          this.router.navigate(['profile'])
        })
      }
    })
  }
}
