import { ContractManagerDetailsComponent } from './../../../../components/dialog/contract-manager-details/contract-manager-details-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Component, OnInit, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { PdfInfo, PdfService } from 'src/app/services/pdf/pdf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ContractService } from 'src/app/services/contract/contract.service';


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

  // 상태관리 --------------------------
  pdfInfo: WritableSignal<PdfInfo> = this.pdfService.pdfInfo;
  pdfLength: WritableSignal<number> = this.pdfService.pdfLength;
  currentPage: WritableSignal<number> = this.pdfService.currentPage;

  userInfoStore = this.authService.getTokenInfo();
  contractMod: WritableSignal<string> = this.contractService.contractMod;


  constructor() {
    this.contractId = this.route.snapshot.params['id'];
    this.contractMod.set(this.route.snapshot.url[0].path)
    this.getPdf()
  }

  async getPdf() {
    if (this.contractMod() === 'sign' || this.contractMod() === 'detail') {
      this.contractInfo = await lastValueFrom(this.contractService.getManagerContract(this.contractId))
      this.contract = await lastValueFrom(this.contractService.downloadManagerContract(this.contractInfo?.data?.key))
      this.pdfService.readFile(this.contract)
    }
  }

  // back page
  backPage() {
    // this.router.navigate([`/company/${this.companyId}/contract`]);
  }

  // modal Contract save
  openSignContract() {

    const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
      data: {
        ...this.contractInfo.data,
      }
    });
  }

  openDetailContract() {
    const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
      data: {
        ...this.contractInfo.data,
      }
    });
  }
}
