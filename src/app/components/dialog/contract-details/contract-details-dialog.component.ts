import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, ViewChild, ElementRef, WritableSignal, inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileData } from 'src/app/interfaces/user-profile-data.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ProfileService } from 'src/app/stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DrawStoreService } from 'src/app/services/draw-store/draw-store.service';
import { EditInfo, EditInfoService } from 'src/app/stores/edit-info/edit-info.service';
import { CanvasService } from 'src/app/services/canvas/canvas.service';
import { RenderingService } from 'src/app/services/rendering/rendering.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-contract-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  templateUrl: './contract-details-dialog.component.html',
  styleUrls: ['./contract-details-dialog.component.scss']
})
export class ContractDetailsComponent implements AfterViewInit {

  router = inject(Router);

  contractService = inject(ContractService)
  renderingService = inject(RenderingService)
  canvasService = inject(CanvasService)
  editInfoService = inject(EditInfoService)
  drawStoreService = inject(DrawStoreService)


  contractMod: WritableSignal<string>
  editInfo: WritableSignal<EditInfo>

  rejectedReason = new FormControl<any>('');


  userProfileData: UserProfileData;

  @ViewChild('canvasContainer', { static: false }) public canvasContainerRef!: ElementRef;
  @ViewChild('employeeCanvasCover', { static: false }) public employeeCanvasCoverRef!: ElementRef;
  @ViewChild('employeeCanvas', { static: false }) public employeeCanvasRef!: ElementRef;
  @ViewChild('managerCanvasCover', { static: false }) public managerCanvasCoverRef!: ElementRef;
  @ViewChild('managerCanvas', { static: false }) public managerCanvasRef!: ElementRef;

  canvasContainer!: HTMLDivElement;
  employeeCanvasCover!: HTMLCanvasElement;
  employeeCanvas!: HTMLCanvasElement;
  managerCanvasCover!: HTMLCanvasElement;
  managerCanvas!: HTMLCanvasElement

  constructor(
    public dialogRef: MatDialogRef<ContractDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: ProfileService,
    private leaveService: LeaveService,
    private dialogService: DialogService
  ) {
    this.contractMod = this.contractService.contractMod
    this.editInfo = this.editInfoService.editInfo
    this.userProfileData = this.profileService.userProfile()?.profileData?.user

    // this.drawVar = this.drawStoreService.drawVar

    console.log(this.userProfileData)
    console.log(this.data)

  }


  ngAfterViewInit() {

    this.setCanvasSize()


    // 매니저 서명이 존재하면 매니저 서명 draw
    if (this.data?.managerStatus === 'signed') {
      this.drawStoreService.drawVar.set(this.data?.managerSign)
      this.pageRender(this.managerCanvas)
      this.drawStoreService.resetDrawingEvents(); // 매니저 서명을 그리고 나면 초기화
    }

    // 직원 서명이 존재하면 직원 서명 draw
    if (this.data?.employeeStatus === 'signed') {
      this.drawStoreService.drawVar.set(this.data?.employeeSign)
      this.pageRender(this.employeeCanvas)
      this.drawStoreService.resetDrawingEvents(); // 직원 서명을 그리고 나면 초기화
    }

    // 서명은 무조건 펜으로
    const currentTool = this.editInfo().toolsConfig['pen'];

    // 사인모드일 경우
    if (this.contractMod() === 'sign') {
      // 캔버스에 드로우 이벤트를 연결
      this.canvasService.addEventHandler(this.employeeCanvasCover, this.employeeCanvas, currentTool, 1);
    }
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

    this.managerCanvas = this.managerCanvasRef.nativeElement;
    this.managerCanvasCover = this.managerCanvasCoverRef.nativeElement;

    // Canvas Container Size 조절
    this.canvasContainer.style.width = 300 + 'px';
    this.canvasContainer.style.height = 150 + 'px';

    this.employeeCanvasCover.width = 300
    this.employeeCanvasCover.height = 150

    // Cover Canvas 조절
    this.employeeCanvas.width = this.employeeCanvasCover.width
    this.employeeCanvas.height = this.employeeCanvasCover.height

    // 서명란 색감 주기
    if (this.contractMod() === 'sign') {
      const ctx = this.employeeCanvas.getContext('2d');
      ctx!.fillStyle = "#F5F5F5";
      ctx!.fillRect(0, 0, this.employeeCanvas.width, this.employeeCanvas.height);
    }
    this.managerCanvasCover.width = 300
    this.managerCanvasCover.height = 150

    this.managerCanvas.width = this.managerCanvasCover.width
    this.managerCanvas.height = this.managerCanvasCover.height
  }


  pageRender(canvas: HTMLCanvasElement) {
    const drawingEvents = this.drawStoreService.getDrawingEvents(1);
    this.renderingService.renderBoard(canvas, 1, drawingEvents);
  }

  /**
   * 확인 다이얼로그!
   */
  openConfirmDialog() {
    const requestBody = {
      contractId: this.data._id,
      employeeSign: this.drawStoreService.getDrawingEvents(1), // 첫번째 페이지의 드로잉 이벤트 
      employeeSignedTime: moment().format("YYYY-MM-DD HH:mm ddd")
    }
    this.dialogService.openDialogConfirm('Would you like to proceed with the signature?').subscribe({
      next: (res) => {
        this.dialogRef.close()
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
    this.contractService.signContract(requestBody).subscribe({
      next: (res: any) => {
        this.dialogService.openDialogPositive('Contract signed successfully').subscribe({
          next: (res) => {
            this.dialogRef.close()
          }
        })
        this.router.navigate(['contract-management/contract'])
      },
      error: (err: any) => {
        this.dialogService.openDialogNegative(err.error.message)
      }
    })
  }

  /** 
   * 거절  
   */
  openRejectContractDialog() {
    const requestBody = {
      contractId: this.data._id,
      employeeRejectReason: this.rejectedReason.value,
      employeeSignedTime: moment().format("YYYY-MM-DD HH:mm ddd")
    }
    this.dialogService.openDialogConfirm('Do you really wish to refuse signing this document?').subscribe({
      next: (res) => {
        this.dialogRef.close()
        // 거절 api 실행
        if (res) {
          this.rejectContract(requestBody)
        }
      }
    })
  }

  rejectContract(requestBody: any) {
    this.contractService.rejectContract(requestBody).subscribe({
      next: (res: any) => {
        this.dialogService.openDialogPositive('Contract rejected successfully').subscribe({
          next: (res) => {
            this.dialogRef.close()
          }
        })
        this.router.navigate(['contract-management/contract'])
      },
      error: (err: any) => {
        this.dialogService.openDialogNegative(err.error.message)
      }
    })
  }

}
