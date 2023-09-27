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
import { MatNativeDateModule } from '@angular/material/core';
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
  userLeaveData: any;

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

  leaveLoadingStatus: boolean = true;
  tempDate: any;
  rolloverStartMonth: Date = new Date()
  rolloverMaxMonth: Date = new Date()

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
      if (this.userProfileData) {

        this.rolloverMaxMonth.setMonth(new Date(this.userProfileData!.empStartDate).getMonth() + this.userLeaveData.rolloverMaxMonth)
        this.rolloverMaxMonth.setDate(new Date(this.userProfileData!.empStartDate).getDate())

        this.rolloverStartMonth.setMonth(new Date(this.userProfileData!.empStartDate).getMonth())
        this.rolloverStartMonth.setDate(new Date(this.userProfileData!.empStartDate).getDate())
      }

    })

    this.requestLeaveForm.get('leaveStartDate')?.valueChanges.subscribe(newValue => {

      if (this.userLeaveData.annualPolicy != 'byContract') {
        this.tempDate = moment(this.userProfileData?.empStartDate).set('year', moment(this.requestLeaveForm.get('leaveStartDate')?.value).year()).set('month', 1).set('date', 1)
      } else {
        this.tempDate = moment(this.userProfileData?.empStartDate).set('year', moment(this.requestLeaveForm.get('leaveStartDate')?.value).year())
      }

      // Set the same value for leaveEndDate when leaveStartDate changes
      if (!this.requestLeaveForm.get('leaveEndDate')?.value) {
        this.requestLeaveForm.get('leaveEndDate')?.setValue(newValue);
      }

    });

    this.requestCountryHoliday();
    this.requestCompanyHoliday();

    this.leaveLoadingStatus = true;
    this.leaveService.leaveInformation().subscribe((res: any) => {
      this.employeeAnnualLeave = res.employeeAnnualLeave;
      this.employeeRollover = res.employeeRollover;
      this.employeeSickLeave = res.employeeSickLeave;
      this.leaveLoadingStatus = false;
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

    const isRolloverBefore = moment(this.rolloverStartMonth).isBefore(moment(d))
    const isRolloverAfter = moment(this.rolloverMaxMonth).isAfter(moment(d))

    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && !isCountryHoliday.length && !isCompanyHoliday.length
      && (this.requestLeaveForm.get('leaveType')?.value == 'rollover' ? isRolloverBefore && isRolloverAfter : true);
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
    const isContain = this.tempDate.isBetween(this.requestLeaveForm.get('leaveStartDate')?.value, this.requestLeaveForm.get('leaveEndDate')?.value, 'day', '[]');

    if (isContain
      && moment(this.requestLeaveForm.get('leaveStartDate')?.value).diff(this.requestLeaveForm.get('leaveEndDate')?.value, 'day') != 0
      && (!moment(this.requestLeaveForm.get('leaveStartDate')?.value).isSame(moment(new Date(this.tempDate.year(), this.tempDate.month(), this.tempDate.date()))))
    ) {

      console.log(this.requestLeaveForm.get('leaveStartDate')?.value, this.requestLeaveForm.get('leaveEndDate')?.value, new Date(this.tempDate.year(), this.tempDate.month(), this.tempDate.date()), new Date(this.tempDate.year(), this.tempDate.month(), this.tempDate.date() - 1))

      this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
        if (answer) {
          this.leaveService.requestLeave({
            ...this.requestLeaveForm.value,
            leaveStartDate: this.requestLeaveForm.get('leaveStartDate')?.value,
            leaveEndDate: new Date(this.tempDate.year(), this.tempDate.month(), this.tempDate.date() - 1),
            employeeAnnualLeave: this.employeeAnnualLeave,
            employeeRollover: this.employeeRollover,
            employeeSickLeave: this.employeeSickLeave
          }).subscribe({
            next: (res: any) => {
              if (res.message == 'success') {

                this.leaveService.requestLeave({
                  ...this.requestLeaveForm.value,
                  leaveStartDate: new Date(this.tempDate.year(), this.tempDate.month(), this.tempDate.date()),
                  leaveEndDate: this.requestLeaveForm.get('leaveEndDate')?.value,
                  employeeAnnualLeave: this.employeeAnnualLeave,
                  employeeRollover: this.employeeRollover,
                  employeeSickLeave: this.employeeSickLeave
                }).subscribe({
                  next: (res: any) => {
                    if (res.message == 'success') {

                      this.dialogService.openDialogPositive('request success').subscribe(() => {
                        this.router.navigate(['/leave/leave-request-list'])
                      })
                    } else {
                      this.dialogService.openDialogNegative(res.message);
                    }
                  },
                  error: (e) => {
                    console.error(e)
                    this.dialogService.openDialogNegative(e)
                  }
                })
              } else {
                this.dialogService.openDialogNegative(res.message);
              }
            },
            error: (e) => {
              console.error(e)
              this.dialogService.openDialogNegative(e)
            }
          })
        }
      })

    } else {
      this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
        if (answer) {
          this.leaveService.requestLeave({
            ...this.requestLeaveForm.value,
            employeeAnnualLeave: this.employeeAnnualLeave,
            employeeRollover: this.employeeRollover,
            employeeSickLeave: this.employeeSickLeave
          }).subscribe({
            next: (res: any) => {
              if (res.message == 'success') {

                this.dialogService.openDialogPositive('request success').subscribe(() => {
                  this.router.navigate(['/leave/leave-request-list'])
                })
              } else {
                this.dialogService.openDialogNegative(res.message);
              }
            },
            error: (e) => {
              console.error(e)
              this.dialogService.openDialogNegative(e)
            }
          })
        }
      })
    }


  }
}
