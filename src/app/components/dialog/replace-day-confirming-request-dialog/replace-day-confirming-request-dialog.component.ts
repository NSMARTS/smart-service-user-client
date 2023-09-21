import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';

interface FormData {
  duration: FormControl;
  managerReason: FormControl;
}

@Component({
  selector: 'app-replace-day-confirming-request-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './replace-day-confirming-request-dialog.component.html',
  styleUrls: ['./replace-day-confirming-request-dialog.component.scss']
})
export class ReplaceDayConfirmingRequestDialogComponent implements OnInit {
  rejectedReason = new FormControl<any>('');
  ConfirmForm: FormGroup = new FormGroup<FormData>({
    duration: new FormControl(0),
    managerReason: new FormControl('')
  })

  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);


  constructor(
    public dialogRef: MatDialogRef<ReplaceDayConfirmingRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: ProfileService,
    private leaveService: LeaveService,
    private dialogService: DialogService
  ) {
    this.userProfile$.subscribe(() => {
      this.userProfileData = this.profileService.userProfile().profileData?.user;
    })
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  /**
   * 휴일 신청 승인
   */
  acceptRequest() {
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      const data: any = this.ConfirmForm.value;
      data._id = this.data._id;
      this.leaveService.acceptReplacementConfirm({ data }).subscribe((res: any) => {
        if (res.message == 'update success') {
          this.dialogService.openDialogPositive('Your vacation has been accepted normally.').subscribe(() => {
            this.dialogRef.close('success')
          })
        }
      })
    })
  }

  /**
   * 휴일 신청 거절
   */
  rejectRequest() {
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      if (answer) {
        const data: any = this.ConfirmForm.value;
        data._id = this.data._id;
        this.leaveService.rejectReplacementConfirm({ data }).subscribe((res: any) => {
          if (res.message == 'update success') {
            this.dialogService.openDialogPositive('Your vacation has been cancelled normally.').subscribe(() => {
              this.dialogRef.close('success')
            })
          }
        })
      }
    })

  }
}
