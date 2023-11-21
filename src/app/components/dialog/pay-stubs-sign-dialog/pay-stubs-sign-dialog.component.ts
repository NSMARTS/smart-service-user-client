import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Optional, ViewChild, WritableSignal, inject, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialsModule } from "src/app/materials/materials.module";
import { CanvasService } from 'src/app/services/canvas/canvas.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DrawStoreService } from 'src/app/services/draw-store/draw-store.service';
import { RenderingService } from 'src/app/services/rendering/rendering.service';
import { EditInfo, EditInfoService } from 'src/app/stores/edit-info/edit-info.service';
import * as moment from 'moment';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pay-stubs-sign-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  templateUrl: './pay-stubs-sign-dialog.component.html',
  styleUrls: ['./pay-stubs-sign-dialog.component.scss']
})
export class PayStubsSignDialogComponent {

  router = inject(Router)
  contractService = inject(ContractService)
  renderingService = inject(RenderingService)
  canvasService = inject(CanvasService)
  editInfoService = inject(EditInfoService)
  drawStoreService = inject(DrawStoreService)
  dialogService = inject(DialogService)

  @ViewChild('canvasContainer', { static: false }) public canvasContainerRef!: ElementRef;
  @ViewChild('employeeCanvasCover', { static: false }) public employeeCanvasCoverRef!: ElementRef;
  @ViewChild('employeeCanvas', { static: false }) public employeeCanvasRef!: ElementRef;

  canvasContainer!: HTMLDivElement;
  employeeCanvasCover!: HTMLCanvasElement;
  employeeCanvas!: HTMLCanvasElement;

  editInfo: WritableSignal<EditInfo>


  constructor(
    public dialogRef: MatDialogRef<PayStubsSignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(this.data)
    this.editInfo = this.editInfoService.editInfo
  }


  ngAfterViewInit() {
    this.setCanvasSize()
  }

  /**
    * Canvas size 설정
    *
    * @param currentPage
    * @param zoomScale
    * @returns
    */
  setCanvasSize() {

    // canvas Element 할당
    this.canvasContainer = this.canvasContainerRef.nativeElement;
    this.employeeCanvas = this.employeeCanvasRef.nativeElement;
    this.employeeCanvasCover = this.employeeCanvasCoverRef.nativeElement;

    // Canvas Container Size 조절
    this.canvasContainer.style.width = 300 + 'px';
    this.canvasContainer.style.height = 150 + 'px';

    this.employeeCanvasCover.width = 300
    this.employeeCanvasCover.height = 150

    // Cover Canvas 조절
    this.employeeCanvas.width = this.employeeCanvasCover.width
    this.employeeCanvas.height = this.employeeCanvasCover.height



    // 서명은 무조건 펜으로
    const currentTool = this.editInfo().toolsConfig['pen'];

    if (this.data?.status === 'pending' && !this.data?.managerMode) {
      // 서명란 색감 주기
      const ctx = this.employeeCanvas.getContext('2d');
      ctx!.fillStyle = "#F5F5F5";
      ctx!.fillRect(0, 0, this.employeeCanvas.width, this.employeeCanvas.height);
      this.canvasService.addEventHandler(this.employeeCanvasCover, this.employeeCanvas, currentTool, 1);
    }

    // 직원 서명이 존재하면 매니저 서명 draw
    if (this.data?.status === 'signed') {
      this.drawStoreService.drawVar.set(this.data?.employeeSign)
      this.pageRender(this.employeeCanvas)
      this.drawStoreService.resetDrawingEvents(); // 직원 서명을 그리고 나면 초기화
    }

  }


  pageRender(canvas: HTMLCanvasElement) {
    const drawingEvents = this.drawStoreService.getDrawingEvents(1);
    this.renderingService.renderBoard(canvas, 1, drawingEvents);
  }

  /**
   * 확인 다이얼로그!
   */
  openConfirmDialog() {
    console.log(this.data)
    const requestBody = {
      contractId: this.data._id,
      employeeSign: this.drawStoreService.getDrawingEvents(1), // 첫번째 페이지의 드로잉 이벤트 
      employeeSignedTime: moment().format("YYYY-MM-DD HH:mm ddd")
    }
    this.dialogService.openDialogConfirm('Would you like to proceed with the signature?').subscribe({
      next: (res) => {
        this.dialogRef.close('successSign')
        // 서명을 하지 않았을 경우 서명안했다고 경고문
        if (res && !this.drawStoreService.getDrawingEvents(1)) {
          this.dialogService.openDialogNegative('You did not sign.')
        }
        // 서명 api 실행
        else if (res) {
          this.signContract(requestBody)
        }
      }
    })
  }

  /**
   * 서명 시작
   * @param requestBody {contractId, employeeSign, employeeSignedTime}
   */
  signContract(requestBody: any) {
    this.contractService.signPayStub(requestBody).subscribe({
      next: (res: any) => {
        this.dialogService.openDialogPositive('Contract signed successfully').subscribe({
          next: (res) => {
            this.dialogRef.close()
          }
        })
      },
      error: (err: any) => {
        this.dialogService.openDialogNegative(err.error.message)
      }
    })
  }

}
