import { ContractManagerDetailsComponent } from './../../../../components/dialog/contract-manager-details/contract-manager-details-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Component, OnInit, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import * as moment from 'moment';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { PdfInfo, PdfService } from 'src/app/services/pdf/pdf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ContractDetailsComponent } from 'src/app/components/dialog/contract-details/contract-details-dialog.component';


@Component({
  selector: 'app-board-nav',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './board-nav.component.html',
  styleUrls: ['./board-nav.component.scss']
})
export class BoardNavComponent {

  // 의존성 주입 -------------------------
  router = inject(Router)
  route = inject(ActivatedRoute)
  dialog = inject(MatDialog)

  dialogService = inject(DialogService)
  pdfService = inject(PdfService)
  authService = inject(AuthService)
  contractService = inject(ContractService)

  // 변수 선언 -------------------------
  contractId: string;
  contractInfo: any;
  contract: any;
  currentUrl: string; // 현재 url이 'contract' 인지, 'manager contract'인지 확인

  // 상태관리 --------------------------
  pdfInfo: WritableSignal<PdfInfo> = this.pdfService.pdfInfo;
  pdfLength: WritableSignal<number> = this.pdfService.pdfLength;
  currentPage: WritableSignal<number> = this.pdfService.currentPage;

  userInfoStore = this.authService.getTokenInfo();
  contractMod: WritableSignal<string> = this.contractService.contractMod; //


  constructor() {
    // 현재 url이 'contract' 인지, 'manager contract'인지 확인
    this.currentUrl = this.router.url.split('/')[2];
    this.contractId = this.route.snapshot.params['id'];
    this.contractMod.set(this.route.snapshot.url[0].path)
    this.getPdf()
  }

  async getPdf() {
    this.contractInfo = await lastValueFrom(this.contractService.getContract(this.contractId))
    this.contract = await lastValueFrom(this.contractService.downloadContract(this.contractInfo?.data?.key))
    this.pdfService.readFile(this.contract)

  }

  // back page
  backPage() {
    if (this.currentUrl === 'contract') {
      this.router.navigate(['/contract-management/contract']);
    }
    if (this.currentUrl === 'manager-contract') {
      this.router.navigate(['/contract-management/manager-contract']);
    }
  }

  // modal Contract save
  openSignContract(rejectMod: boolean) {

    if (this.currentUrl === 'contract') {
      const dialogRef = this.dialog.open(ContractDetailsComponent, {
        data: {
          ...this.contractInfo.data,
          currentUrl: this.currentUrl,
          rejectMod: rejectMod
        }
      });
    }
    if (this.currentUrl === 'manager-contract') {
      const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
        data: {
          ...this.contractInfo.data,
          currentUrl: this.currentUrl,
          rejectMod: rejectMod
        }
      });
    }

  }

  openDetailContract() {
    if (this.currentUrl === 'contract') {
      const dialogRef = this.dialog.open(ContractDetailsComponent, {
        data: {
          ...this.contractInfo.data,
          currentUrl: this.currentUrl,
        }
      });
    }
    if (this.currentUrl === 'manager-contract') {
      const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
        data: {
          ...this.contractInfo.data,
          currentUrl: this.currentUrl,
        }
      });
    }
  }
}
