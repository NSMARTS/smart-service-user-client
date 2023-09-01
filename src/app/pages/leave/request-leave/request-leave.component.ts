/**
 * Version 1.0
 * 파일명: request-leave.components.ts
 * 작성일시: 2023-08-28
 * 작성자: 임호균
 * 설명: 휴가 신청 처리
 */


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialsModule } from 'src/app/materials/materials.module';
import {MatNativeDateModule} from '@angular/material/core';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import * as moment from 'moment';

interface FormData {
  leaveType: FormControl;
  leaveDay: FormControl;
  leaveReason: FormControl;
  leaveStartDate: FormControl;
  leaveEndDate: FormControl;
}

@Component({
  selector: 'app-request-leave',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss']
})
export class RequestLeaveComponent {
  userProfileData: UserProfileData | undefined;
  userLeaveData : any;

  userProfile$ = toObservable(this.profileService.userProfile);
  requestLeaveForm: FormGroup = new FormGroup<FormData>({
    leaveType: new FormControl('', [Validators.required]),
    leaveDay: new FormControl('', [Validators.required]),
    leaveReason: new FormControl('', [Validators.required]),
    leaveStartDate: new FormControl<Date | null>(null, [Validators.required]),
    leaveEndDate: new FormControl<Date | null>(null, [Validators.required]),
  })

  countryHoliday: any = [];
  companyHoliday: any = [];

  employeeAnnualLeave: number | undefined;
  employeeRollover: number | undefined;
  employeeSickLeave: number | undefined;

  constructor(
    private profileService: ProfileService, 
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private dialogService: DialogService,
    private router: Router,
  ) {
      this.userProfile$.subscribe(() => {
        this.userProfileData = this.profileService.userProfile().profileData?.user;
        this.userLeaveData = this.profileService.userProfile().personalLeaveData;

      })

      this.requestLeaveForm.get('leaveStartDate')?.valueChanges.subscribe(newValue => {
        // Set the same value for leaveEndDate when leaveStartDate changes
        if(this.requestLeaveForm.value.leaveDay = 'half')
          this.requestLeaveForm.get('leaveEndDate')?.setValue(newValue);
      });

      this.requestCountryHoliday();
      this.requestCompanyHoliday();

      this.leaveService.leaveInformation().subscribe((res:any) => {
        this.employeeAnnualLeave = res.employeeAnnualLeave;
        this.employeeRollover = res.employeeRollover;
        this.employeeSickLeave = res.employeeSickLeave;
      });
  }
  
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();

    //국가 휴일 체크
    const isCountryHoliday = this.countryHoliday.filter((holiday: any) => {
      return moment(d).isSame(holiday.holidayDate)
    })

    //회사 휴일 체크
    const isCompanyHoliday = this.companyHoliday.filter((holiday: any) => {
      return moment(d).isSame(holiday.companyHolidayDate)
    })

    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && !isCountryHoliday.length && !isCompanyHoliday.length;
  };


  requestCompanyHoliday() {
    this.holidayService.requestCompanyHoliday().subscribe((res) => {
      this.companyHoliday = res;
    })
  }

  requestCountryHoliday() {
    this.holidayService.requestCountryHoliday().subscribe((res) => {
      this.countryHoliday = res;
    })
  }

  requestLeave() {
    this.leaveService.requestLeave({...this.requestLeaveForm.value, 
      employeeAnnualLeave: this.employeeAnnualLeave, 
      employeeRollover: this.employeeRollover,
      employeeSickLeave: this.employeeSickLeave
    }).subscribe({
      next: (res: any) => {
        if(res.message == 'success') {
          this.dialogService.openDialogPositive('request success');
          this.router.navigate(['/leave/leave-request-list'])
        }else{
          this.dialogService.openDialogNegative(res.message);
        }
      },
      error: (e) => {
        // console.error(e)
        this.dialogService.openDialogPositive(e)
      }
    })
  }
}
