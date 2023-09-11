import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';

interface FormData {
  leaveReason: FormControl;
  leaveStartDate: FormControl;
  leaveEndDate: FormControl;
}

@Component({
  selector: 'app-replacement-day-confirming-request',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    MatNativeDateModule,
    RouterModule
  ],
  templateUrl: './replacement-day-confirming-request.component.html',
  styleUrls: ['./replacement-day-confirming-request.component.scss']
})
export class ReplacementDayConfirmingRequestComponent {
  userProfileData: UserProfileData | undefined;

  userProfile$ = toObservable(this.profileService.userProfile);
  requestLeaveForm: FormGroup = new FormGroup<FormData>({
    leaveReason: new FormControl('', [Validators.required]),
    leaveStartDate: new FormControl<Date | null>(null, [Validators.required]),
    leaveEndDate: new FormControl<Date | null>(null, [Validators.required]),
  })

  constructor(
    private profileService: ProfileService, 
    private leaveService: LeaveService,
    private dialogService: DialogService,
    private router: Router,
  ) {
      this.userProfile$.subscribe(() => {
        this.userProfileData = this.profileService.userProfile().profileData?.user;
      })

      this.requestLeaveForm.get('leaveStartDate')?.valueChanges.subscribe(newValue => {
        if (!this.requestLeaveForm.get('leaveEndDate')?.value) {
          this.requestLeaveForm.get('leaveEndDate')?.setValue(newValue);
        }
      });
  }

  requestConfirm() {
    const data = this.requestLeaveForm.value;
    this.leaveService.requestReplacementConfirm(data).subscribe((res:any) => {
      if(res.message == 'success'){
        this.dialogService.openDialogPositive('request success');
          this.router.navigate(['/leave/rd-request-list'])
      }else{
        this.dialogService.openDialogNegative(res.message);
      }
    })
  }
}
