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
import { RouterModule } from '@angular/router';
interface FormData {
  leaveClassification: FormControl;
  unitOfUse: FormControl;
  reason: FormControl;
  start: FormControl;
  end: FormControl;
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
  userProfile$ = toObservable(this.profileService.userProfile);
  requestLeaveForm: FormGroup = new FormGroup<FormData>({
    leaveClassification: new FormControl('', [Validators.required]),
    unitOfUse: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  })

  constructor(
    private profileService: ProfileService, 
  ) {
      this.userProfile$.subscribe(() => {
        this.userProfileData = this.profileService.userProfile().user;
      })
  }

  requestLeave() {
    console.log(this.requestLeaveForm.value)
  }
}
