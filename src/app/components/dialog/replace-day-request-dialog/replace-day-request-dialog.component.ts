import { CommonModule } from '@angular/common';
import { Component, OnInit,Inject} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ProfileService } from 'src/app/stores/profile/profile.service';

@Component({
  selector: 'app-replace-day-request-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './replace-day-request-dialog.component.html',
  styleUrls: ['./replace-day-request-dialog.component.scss']
})
export class ReplaceDayRequestDialogComponent implements OnInit{
  userProfileData: UserProfileData | undefined;
  userProfile$ = toObservable(this.profileService.userProfile);

  constructor(
    public dialogRef: MatDialogRef<ReplaceDayRequestDialogComponent>,
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
}
