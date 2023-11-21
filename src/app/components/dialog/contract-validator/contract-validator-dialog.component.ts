import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-contract-validator-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './contract-validator-dialog.component.html',
  styleUrls: ['./contract-validator-dialog.component.scss']
})
export class ContractValidatorDialogComponent {
  router = inject(Router);
  contractService = inject(ContractService);

  userProfileData: UserProfileData;

  fileName = 'Select File';
  currentFile?: File; // 파일 업로드 시 여기에 관리

  constructor(
    public dialogRef: MatDialogRef<ContractValidatorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: ProfileService,
    private dialogService: DialogService
  ) {
    this.userProfileData = this.profileService.userProfile()?.profileData?.user
  }

  /**
 * 새로운 File Load (Local)
 * - @output으로 main component(white-board.component로 전달)
 * @param event
 * @returns
 */
  async onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      return;
    }
    const file: File = inputElement.files[0];

    // 파일 유효성 검사
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

    if (ext !== 'pdf') {
      this.dialogService.openDialogNegative(`Please, upload the '.pdf' file.`);
      return;
    }
    // this.isLoadingResults = true;

    this.currentFile = file;
    this.fileName = this.currentFile.name;
  }

  validateContract() {
    if (!this.currentFile) {
      this.dialogService.openDialogNegative(`Please, upload a contract file.`);
      return
    }

    // 만약 contract 모드일경우
    if (this.data.contractMod) {
      this.contractService.verifyContract(this.data.id, this.currentFile).subscribe({
        next: (res: any) => { this.dialogService.openDialogPositive(res.message) },
        error: (error) => { this.dialogService.openDialogNegative(error.error.message) }
      })
      // 만약 contract 모드가 아닌 경우 (paystubs 명세서 모드) api가 달라진다
    } else if (!this.data.contractMod) {
      this.contractService.verifyPayStub(this.data.id, this.currentFile).subscribe({
        next: (res: any) => { this.dialogService.openDialogPositive(res.message) },
        error: (error) => { this.dialogService.openDialogNegative(error.error.message) }
      })
    }

  }


}
