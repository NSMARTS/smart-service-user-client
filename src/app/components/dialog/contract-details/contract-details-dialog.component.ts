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
  selector: 'app-contract-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './contract-details-dialog.component.html',
  styleUrls: ['./contract-details-dialog.component.scss']
})
export class ContractDetailsComponent implements OnInit {

  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);

  constructor(
    public dialogRef: MatDialogRef<ContractDetailsComponent>,
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
            this.dialogService.openDialogNegative(err.error.message)
          }
        })
      }
    })

  }
}
