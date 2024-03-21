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
  imports: [CommonModule, MaterialsModule, MatNativeDateModule, RouterModule],
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss'],
})
export class RequestLeaveComponent {
  userProfileData: UserProfileData | undefined;
  userLeaveData: any;

  // 바라보고 있는 유저 정보
  userProfile$ = toObservable(this.profileService.userProfile);

  // 연차 신청 양식
  requestLeaveForm: FormGroup = new FormGroup<FormData>({
    leaveType: new FormControl('', [Validators.required]),
    leaveDay: new FormControl('', [Validators.required]),
    leaveReason: new FormControl('', [Validators.required]),
    leaveStartDate: new FormControl<Date | null>(null, [Validators.required]),
    leaveEndDate: new FormControl<Date | null>(null, [Validators.required]),
  });

  // 해당 나라, 회사 연차 정보
  countryHoliday: any = [];
  companyHoliday: any = [];

  // 직원 연차 정보
  employeeAnnualLeave: number | undefined;
  employeeRollover: number | undefined;
  employeeSickLeave: number | undefined;

  // 연차 정보 로딩 중
  leaveLoadingStatus: boolean = true;

  // 연차정책이 'by year' 일 때 시간 차이 해결을 위한 변수
  tempDate: any;

  rolloverStartMonth: Date = new Date();
  rolloverMaxMonth: Date = new Date();

  isSubmitting: boolean = false;

  constructor(
    private profileService: ProfileService,
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private dialogService: DialogService,
    private router: Router
  ) {
    // 바라보고 있는 유저 정보 분리해서 각 변수(유저프로필정보, 유저연차정보)에 저장
    this.userProfile$.subscribe(() => {
      this.userProfileData =
        this.profileService.userProfile().profileData?.user;
      this.userLeaveData = this.profileService.userProfile().personalLeaveData;

      console.log(this.rolloverMaxMonth);
      // 연자 정책에 따라 각 변수(롤오버최대기간, 롤오버시작일)에 저장
      if (this.userProfileData) {
        // 'by year'일 경우
        if (this.userLeaveData.annualPolicy != 'byContract') {
          // 롤오버최대기간 - 1월 1일에 this.userLeaveData.rolloverMaxMonth만큼 계산해 최대일자를 저장한다.
          this.rolloverMaxMonth.setMonth(this.userLeaveData.rolloverMaxMonth);
          this.rolloverMaxMonth.setDate(0);

          // 롤오버시작일 - 1월 1일로 저장
          this.rolloverStartMonth.setMonth(0);
          this.rolloverStartMonth.setDate(1);

          console.log(this.rolloverStartMonth, this.rolloverMaxMonth);
        }
        // 'by contract'일 경우
        else {
          // 롤오버최대기간(월) - 계약일의 월 + 롤오버최대기간
          this.rolloverMaxMonth.setMonth(
            new Date(this.userProfileData!.empStartDate).getMonth() +
              this.userLeaveData.rolloverMaxMonth
          );

          // 롤오버최대기간(일) - 계약일의 일만 그대로 저장
          this.rolloverMaxMonth.setDate(
            new Date(this.userProfileData!.empStartDate).getDate()
          );

          // 롤오버시작일 - 계약일을 그대로 저장한다
          this.rolloverStartMonth.setMonth(
            new Date(this.userProfileData!.empStartDate).getMonth()
          );
          this.rolloverStartMonth.setDate(
            new Date(this.userProfileData!.empStartDate).getDate()
          );
        }
      }
    });

    // 연차신청 양식의 값을 변경할 때의 조건
    this.requestLeaveForm
      .get('leaveStartDate')
      ?.valueChanges.subscribe((newValue) => {
        // 연차정책이 'by year'일 경우
        if (this.userLeaveData.annualPolicy != 'byContract') {
          // 변수에 계약일을 `연차신청양식의 년 + 2월 1일`로 저장한다.
          this.tempDate = moment(this.userProfileData?.empStartDate)
            .set(
              'year',
              moment(this.requestLeaveForm.get('leaveStartDate')?.value).year()
            )
            .set('month', 1)
            .set('date', 1);
        } else {
          // 연차정책이 'by contract'일 경우 변수에 `연차신청양식의 년 + 계약월 + 계약일`로 저장한다.
          this.tempDate = moment(this.userProfileData?.empStartDate).set(
            'year',
            moment(this.requestLeaveForm.get('leaveStartDate')?.value).year()
          );
        }

        console.log(this.tempDate);

        // Set the same value for leaveEndDate when leaveStartDate changes
        if (!this.requestLeaveForm.get('leaveEndDate')?.value) {
          this.requestLeaveForm.get('leaveEndDate')?.setValue(newValue);
        }
      });

    // 해당 국가, 회사별 휴일 불러오기
    this.requestCountryHoliday();
    this.requestCompanyHoliday();

    // 불러오면 '로딩 중' 표시 끝
    this.leaveLoadingStatus = true;
    this.leaveService.leaveInformation().subscribe((res: any) => {
      this.employeeAnnualLeave = res.employeeAnnualLeave;
      this.employeeRollover = res.employeeRollover;
      this.employeeSickLeave = res.employeeSickLeave;
      this.leaveLoadingStatus = false;
    });
  }

  // 아예 날짜 자체가 선택되지 않게
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let isRolloverBefore: any;
    let isRolloverAfter: any;

    //국가 휴일 체크
    const isCountryHoliday = this.countryHoliday.filter((holiday: any) => {
      return moment(d).isSame(holiday.holidayDate);
    });

    //회사 휴일 체크
    const isCompanyHoliday = this.companyHoliday.filter((holiday: any) => {
      return moment(d).isSame(holiday.companyHolidayDate);
    });

    isRolloverBefore = moment(this.rolloverStartMonth).isBefore(moment(d));
    isRolloverAfter = moment(this.rolloverMaxMonth).isAfter(moment(d));

    this.requestLeaveForm.get('leaveType')?.value == 'rollover'
      ? isRolloverBefore && isRolloverAfter
      : true;

    // Prevent Saturday and Sunday from being selected.
    return (
      day !== 0 &&
      day !== 6 &&
      !isCountryHoliday.length &&
      !isCompanyHoliday.length &&
      (this.requestLeaveForm.get('leaveType')?.value == 'rollover'
        ? isRolloverBefore && isRolloverAfter
        : true)
    );
  };

  requestCompanyHoliday() {
    this.holidayService.requestCompanyHoliday().subscribe((res) => {
      this.companyHoliday = res;
    });
  }

  requestCountryHoliday() {
    this.holidayService.requestCountryHoliday().subscribe((res) => {
      this.countryHoliday = res;
    });
  }

  // 연차 신청
  requestLeave() {
    if (this.isSubmitting) {
      // 이미 제출 중인 경우 함수 실행을 중단합니다.
      return;
    }
    this.isSubmitting = true;

    if (this.userLeaveData.annualPolicy != 'byContract') {
      this.tempDate = moment(this.userProfileData?.empStartDate).set({
        year: moment(this.requestLeaveForm.get('leaveEndDate')?.value).year(),
        month: 0, // 1월을 0으로 설정합니다.
        date: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    } else {
      this.tempDate = moment(this.userProfileData?.empStartDate)
        .set(
          'year',
          moment(this.requestLeaveForm.get('leaveStartDate')?.value).year()
        )
        .startOf('day');
    }

    const isContain = this.tempDate.isBetween(
      this.requestLeaveForm.get('leaveStartDate')?.value,
      this.requestLeaveForm.get('leaveEndDate')?.value,
      'day',
      '[]'
    );

    // isContain은 tempdate( 기준점으로 휴가가 바뀌는 날이다.
    // byYear일 경우 신청해 기준 1월 1일. byContract는 신청해 기준 입사일 )가
    // 휴가 신청 시작날과 끝나는 사이에 있는지 확인하는 조건 true면. 휴가 신청날이 리셋날 사이에 있어 2번 휴가를 신청해야한다.
    // 두번째 조건은 하루만 신청하는거면 2번 신청안함.
    // 세번째 조건은 휴가 신청날이
    if (
      isContain &&
      moment(this.requestLeaveForm.get('leaveStartDate')?.value).diff(
        this.requestLeaveForm.get('leaveEndDate')?.value,
        'day'
      ) != 0 &&
      !moment(this.requestLeaveForm.get('leaveStartDate')?.value).isSame(
        moment(
          new Date(
            this.tempDate.year(),
            this.tempDate.month(),
            this.tempDate.date()
          )
        )
      )
    ) {
      console.log(
        '연차 신청일:',
        this.requestLeaveForm.get('leaveStartDate')?.value,
        '연차 마감일:',
        this.requestLeaveForm.get('leaveEndDate')?.value,
        '계약일:',
        new Date(
          this.tempDate.year(),
          this.tempDate.month(),
          this.tempDate.date()
        ),
        '계약일 -1 :',
        new Date(
          this.tempDate.year(),
          this.tempDate.month(),
          this.tempDate.date() - 1
        )
      );

      this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
        if (answer) {
          this.leaveService
            .requestLeave({
              ...this.requestLeaveForm.value,
              leaveStartDate:
                this.requestLeaveForm.get('leaveStartDate')?.value,
              leaveEndDate: new Date(
                this.tempDate.year(),
                this.tempDate.month(),
                this.tempDate.date() - 1
              ),
              employeeAnnualLeave: this.employeeAnnualLeave,
              employeeRollover: this.employeeRollover,
              employeeSickLeave: this.employeeSickLeave,
            })
            .subscribe({
              next: (res: any) => {
                if (res.message == 'success') {
                  this.leaveService
                    .requestLeave({
                      ...this.requestLeaveForm.value,
                      leaveStartDate: new Date(
                        this.tempDate.year(),
                        this.tempDate.month(),
                        this.tempDate.date()
                      ),
                      leaveEndDate:
                        this.requestLeaveForm.get('leaveEndDate')?.value,
                      employeeAnnualLeave: this.employeeAnnualLeave,
                      employeeRollover: this.employeeRollover,
                      employeeSickLeave: this.employeeSickLeave,
                    })
                    .subscribe({
                      next: (res: any) => {
                        if (res.message == 'success') {
                          this.dialogService
                            .openDialogPositive('request success')
                            .subscribe(() => {
                              this.router.navigate([
                                '/leave/leave-request-list',
                              ]);
                            });
                        } else {
                          this.dialogService.openDialogNegative(res.message);
                        }
                      },
                      error: (e) => {
                        console.error(e);
                        this.dialogService.openDialogNegative(e);
                      },
                      complete: () => {
                        this.isSubmitting = false;
                      },
                    });
                } else {
                  this.isSubmitting = false;
                  this.dialogService.openDialogNegative(res.message);
                }
              },
              error: (e) => {
                console.error(e);
                this.dialogService.openDialogNegative(e);
              },
              complete: () => {
                this.isSubmitting = false;
              },
            });
        }
      });
    } else {
      console.log(this.requestLeaveForm.value);

      this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
        if (answer) {
          this.leaveService
            .requestLeave({
              ...this.requestLeaveForm.value,
              employeeAnnualLeave: this.employeeAnnualLeave,
              employeeRollover: this.employeeRollover,
              employeeSickLeave: this.employeeSickLeave,
            })
            .subscribe({
              next: (res: any) => {
                if (res.message == 'success') {
                  this.dialogService
                    .openDialogPositive('request success')
                    .subscribe(() => {
                      this.router.navigate(['/leave/leave-request-list']);
                    });
                } else {
                  this.dialogService.openDialogNegative(res.message);
                }
              },
              error: (e) => {
                console.error(e);
                this.dialogService.openDialogNegative(e);
              },
              complete: () => {
                this.isSubmitting = false;
              },
            });
        } else {
          this.isSubmitting = false;
        }
      });
    }
  }
}
