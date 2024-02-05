import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
  selector: 'app-leave-request-details',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leave-request-details.component.html',
  styleUrls: ['./leave-request-details.component.scss']
})
export class LeaveRequestDetailsComponent implements OnInit {

  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);
  isSubmitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LeaveRequestDetailsComponent>,
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

  cancelRequest() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.dialogService.openDialogConfirm('').subscribe((answer: any) => {
      if (answer) {
        this.leaveService.cancelLeaveRequest(this.data._id).subscribe({
          next: (res: any) => {
            if (res.message == 'update success') {
              this.dialogService.openDialogPositive('Your vacation has been cancelled normally.').subscribe(() => {
                this.dialogRef.close('success')
              })
            }
          },
          error: (err) => {
            console.log(err)
            this.isSubmitting = false;
            this.dialogService.openDialogNegative(err.error.message)
          }
        })
      } else {
        this.isSubmitting = false;
      }
    })

  }
}
