import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';


interface FormData {
  rejectedReason: FormControl;

}

@Component({
  selector: 'app-leave-request-manager-details',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leave-request-manager-details.component.html',
  styleUrls: ['./leave-request-manager-details.component.scss']
})
export class LeaveRequestManagerDetailsComponent implements OnInit {


  rejectedReason = new FormControl<any>('');



  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);


  constructor(
    public dialogRef: MatDialogRef<LeaveRequestManagerDetailsComponent>,
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
    // console.log(this.data)
  }

  /**
   * 휴가 승인
   */
  approveRequest() {
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      if (answer) {
        this.leaveService.approveLeaveRequest(this.data._id).subscribe({
          next: (res: any) => {
            if (res.message == 'update success') {
              this.dialogService.openDialogPositive('Your   vacation has been cancelled normally.').subscribe(() => {
                this.dialogRef.close('success')
              })
            }
          },
          error: (err: any) => {
            this.dialogService.openDialogNegative(err.error.message)
          }
        })
      }
    }
    )
  }

  /**
   * 휴가 거절
   */
  rejectRequest() {
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      if (answer) {
        this.leaveService.rejectLeaveRequest(this.data._id, this.rejectedReason.value).subscribe({
          next: (res: any) => {
            if (res.message == 'update success') {
              this.dialogService.openDialogPositive('Your vacation has been cancelled normally.').subscribe(() => {
                this.dialogRef.close('success')
              })
            }
          },
          error: (err) => {
            this.dialogService.openDialogNegative(err.error.message)
          }
        })
      }
    })
  }

}
