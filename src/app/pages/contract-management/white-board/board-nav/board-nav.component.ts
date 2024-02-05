import { DrawStoreService } from 'src/app/services/draw-store/draw-store.service';
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
  drawStoreService = inject(DrawStoreService)
  pdfService = inject(PdfService)
  authService = inject(AuthService)
  contractService = inject(ContractService)

  // 변수 선언 -------------------------
  contractId: string;
  contractInfo: any;
  contract: any;
  currentUrl: string; // 현재 url이 'contract' 인지, 'manager contract'인지 확인
  rejectMod: boolean = false;

  // 상태관리 --------------------------
  pdfInfo: WritableSignal<PdfInfo> = this.pdfService.pdfInfo;
  pdfLength: WritableSignal<number> = this.pdfService.pdfLength;
  currentPage: WritableSignal<number> = this.pdfService.currentPage;

  userInfoStore = this.authService.getTokenInfo();
  contractMod: WritableSignal<string> = this.contractService.contractMod; //


  constructor() {
    this.contractMod.set('')
    // 현재 url이 'contract' 인지, 'manager contract'인지 확인
    this.currentUrl = this.router.url.split('/')[2];
    this.contractId = this.route.snapshot.params['id'];
    this.getPdf()
  }

  async getPdf() {
    // pdf정보 가져옴
    try {
      const contract: any = await lastValueFrom(this.contractService.getContract(this.contractId))
      this.contractInfo = contract.data
    } catch (error: any) {
      this.dialogService.openDialogNegative(error.error.message)
    }

    // url과 직원/매니저의 결제 상태에 따라 board-nav에서 상세보기 버튼을 보여줄지, 수락 or 거절 버튼을 보여줄지 결정.  
    if (this.currentUrl === 'contract' && this.contractInfo.employeeStatus !== 'pending') {
      this.contractMod.set('detail')
    } else if (this.currentUrl === 'manager-contract' && this.contractInfo.managerStatus !== 'pending') {
      this.contractMod.set('detail')
    } else {
      this.contractMod.set(this.route.snapshot.url[0].path)
    }

    // pdf 파일을 가져와 렌더링
    this.contract = await lastValueFrom(this.contractService.downloadContract(this.contractInfo?.key))
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
  openSignContract() {
    if (this.currentUrl === 'contract') {
      const dialogRef = this.dialog.open(ContractDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          rejectFormMod: false,
          disableClose: true,

        }
      });
      // 다이얼로그 나가면 드로우이벤트 리셋
      dialogRef.afterClosed().subscribe(result => this.drawStoreService.resetDrawingEvents())
    }
    if (this.currentUrl === 'manager-contract') {
      if (this.contractInfo.managerStatus === 'rejected') this.rejectMod = true
      const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          rejectFormMod: false,
          disableClose: true,

        }
      });
      // 다이얼로그 나가면 드로우이벤트 리셋
      dialogRef.afterClosed().subscribe(result => this.drawStoreService.resetDrawingEvents())
    }

  }

  // modal Contract save
  openRejectContract() {

    if (this.currentUrl === 'contract') {
      const dialogRef = this.dialog.open(ContractDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          rejectFormMod: true
        },
      });
    }
    if (this.currentUrl === 'manager-contract') {
      if (this.contractInfo.managerStatus === 'rejected') this.rejectMod = true
      const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          rejectFormMod: true,
          disableClose: true,

        }
      });
    }

  }

  openDetailContract() {
    if (this.currentUrl === 'contract') {
      const dialogRef = this.dialog.open(ContractDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          disableClose: true,

        }
      });
    }
    if (this.currentUrl === 'manager-contract') {
      const dialogRef = this.dialog.open(ContractManagerDetailsComponent, {
        data: {
          ...this.contractInfo,
          currentUrl: this.currentUrl,
          disableClose: true,

        }
      });
    }
  }
}
