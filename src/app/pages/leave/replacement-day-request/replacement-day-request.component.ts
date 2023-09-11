import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as moment from 'moment';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';
interface FormData {
  leaveType: FormControl;
  leaveDay: FormControl;
  leaveReason: FormControl;
  leaveStartDate: FormControl;
  leaveEndDate: FormControl;
}
@Component({
  selector: 'app-replacement-day-request',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    MatNativeDateModule,
  ],
  templateUrl: './replacement-day-request.component.html',
  styleUrls: ['./replacement-day-request.component.scss']
})
export class ReplacementDayRequestComponent implements OnInit{ 
  userProfileData: UserProfileData | undefined;
  userLeaveData : any;

  userProfile$ = toObservable(this.profileService.userProfile);
  requestLeaveForm: FormGroup = new FormGroup<FormData>({
    leaveType: new FormControl('replacementLeave'),
    leaveDay: new FormControl('', [Validators.required]),
    leaveReason: new FormControl('', [Validators.required]),
    leaveStartDate: new FormControl<Date | null>(null, [Validators.required]),
    leaveEndDate: new FormControl<Date | null>(null, [Validators.required]),
  })
  countryHoliday: any = [];
  companyHoliday: any = [];

  employeeReplacementLeave: number | undefined;

  until: moment.Moment | undefined;
  startDay:  moment.Moment | undefined;

  leaveLoadingStatus: boolean = true;

  constructor(
    private profileService: ProfileService, 
    private leaveService: LeaveService,
    private holidayService: HolidayService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userProfile$.subscribe(() => {
      this.userProfileData = this.profileService.userProfile().profileData?.user;
      this.userLeaveData = this.profileService.userProfile().personalLeaveData;
    })

    this.requestLeaveForm.get('leaveStartDate')?.valueChanges.subscribe(newValue => {
      // Set the same value for leaveEndDate when leaveStartDate changes
        if (!this.requestLeaveForm.get('leaveEndDate')?.value) {
          this.requestLeaveForm.get('leaveEndDate')?.setValue(newValue);
        }
    });

    this.requestCountryHoliday();
    this.requestCompanyHoliday();

    this.leaveLoadingStatus = true;


    this.leaveService.replacementInfo(this.route.snapshot.paramMap.get('_id')!).subscribe((res: any) => {
      this.employeeReplacementLeave = res.item.duration - res.item.taken
      this.until = moment(res.item.approveDay).add(res.item.requestor.personalLeave.rdValidityTerm, 'months');
      this.startDay = moment(res.item.approveDay);
      this.leaveLoadingStatus = false;
    })   
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

    //until 체크
    const before = moment(d || new Date()).isBefore(this.until);
    const after =  moment(d || new Date()).isAfter(this.startDay);


    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && !isCountryHoliday.length && !isCompanyHoliday.length && before && after;
  };


  // 회사 휴일
  requestCompanyHoliday() {
    this.holidayService.requestCompanyHoliday().subscribe((res) => {
      this.companyHoliday = res;
    })
  }


  // 국가 휴일
  requestCountryHoliday() {
    this.holidayService.requestCountryHoliday().subscribe((res) => {
      this.countryHoliday = res;
    })
  }

  // 요청 함수
  requestLeave() {
    console.log(this.requestLeaveForm.value)
    this.leaveService.requestReplacementLeave({...this.requestLeaveForm.value, 
      replacementLeave: this.employeeReplacementLeave,
      _id : this.route.snapshot.paramMap.get('_id')!
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
        this.dialogService.openDialogNegative(e)
      }
    })
  }
}
