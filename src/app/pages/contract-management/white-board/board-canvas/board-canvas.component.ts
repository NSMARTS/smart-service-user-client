import { CommonModule } from "@angular/common";
import { Component, DestroyRef, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, WritableSignal, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { combineLatest, skip } from "rxjs";
import { CANVAS_CONFIG } from "src/app/config/canvas-css";
import { DragScrollDirective } from "src/app/directives/drag-scroll.directive";
import { ContainerScroll, ContainerSize } from "src/app/interfaces/white-board.interface";
import { CanvasService } from "src/app/services/canvas/canvas.service";
import { PdfInfo, PdfService } from "src/app/services/pdf/pdf.service";
import { RenderingService } from "src/app/services/rendering/rendering.service";


@Component({
  selector: 'app-board-canvas',
  standalone: true,
  imports: [
    CommonModule,
    DragScrollDirective
  ],
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss']
})
export class BoardCanvasComponent implements OnInit, OnDestroy {

  // 의존성 주입 ------------------------
  canvasService = inject(CanvasService)
  pdfService = inject(PdfService)
  renderingService = inject(RenderingService)
  renderer = inject(Renderer2)
  destroyRef = inject(DestroyRef);


  rendererEvent!: () => void;

  pdfInfo: WritableSignal<PdfInfo> = this.pdfService.pdfInfo; // 업로드한 pdf 
  pdfInfo$ = this.pdfService.pdfInfo$; // 업로드한 pdf 

  pdfLength: WritableSignal<number> = this.pdfService.pdfLength; // pdf 전체 길이
  currentPage: WritableSignal<number> = this.pdfService.currentPage; // 현재 페이지
  currentPage$ = this.pdfService.currentPage$; // 현재 페이지

  zoomScale: WritableSignal<number> = this.pdfService.zoomScale; // 줌 비율
  zoomScale$ = this.pdfService.zoomScale$; // 줌 비율

  // 사이드 바 썸네일 윈도우 좌표
  containerScroll: WritableSignal<ContainerScroll> = this.canvasService.containerScroll
  // 사이드 바 썸네일 윈도우 크기
  containerSize: WritableSignal<ContainerSize> = this.canvasService.containerSize

  @ViewChild('canvasContainer', { static: true }) public canvasContainerRef!: ElementRef;
  @ViewChild('bg', { static: true }) public bgCanvasRef!: ElementRef;
  @ViewChild('tmp', { static: true }) public tmpCanvasRef!: ElementRef;

  canvasContainer!: HTMLDivElement;
  bgCanvas!: HTMLCanvasElement;
  tmpCanvas!: HTMLCanvasElement;

  constructor() {

    /**
     * pdf가 변경되거나,
     * 현재 페이지가 변경되거나
     * zoom이 됐을 경우
     * 렌더링 함수 실행.
     */
    combineLatest([
      // rxjs 한번에 여러개 합쳐버림
      this.pdfInfo$,
      this.currentPage$,
      this.zoomScale$,
    ])
      .pipe(
        skip(1), // 초기화 시 실행되지 않게 막고
        takeUntilDestroyed(this.destroyRef) // 현재 컴포넌트가 사라지면 rxjs 지워버림
      )
      .subscribe(() => {
        this.onChangePage();
      });
  }

  ngOnInit(): void {
    this.initCanvasSet();
    this.rendererEvent = this.renderer.listen(this.canvasContainer, 'scroll', event => {
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    this.pdfService.memoryRelease();
    // render listener 해제
    this.rendererEvent();
  }

  /**
 * 초기 Canvas 변수, Container Size 설정
 */
  initCanvasSet() {
    this.bgCanvas = this.bgCanvasRef.nativeElement;
    this.tmpCanvas = this.tmpCanvasRef.nativeElement;
    this.canvasContainer = this.canvasContainerRef.nativeElement;

    /* container size 설정 */
    CANVAS_CONFIG.maxContainerHeight = window.innerHeight - CANVAS_CONFIG.toolbarHeight - CANVAS_CONFIG.navHeight; // pdf 불러오기 사이즈
    CANVAS_CONFIG.maxContainerWidth = window.innerWidth - CANVAS_CONFIG.sidebarWidth;

    CANVAS_CONFIG.deviceScale = this.canvasService.getDeviceScale(this.bgCanvas);
  }
  /**
     *  판서 + background drawing
     */

  /**
   * draw + pdf rendering
   *
   * @param currentDocNum
   * @param currentPage
   * @param zoomScale
   */
  pageRender(currentPage: number, zoomScale: number) {

    // zoomIn 시 UI 측면 화면 깜빡임 방지 함수.
    this.preRenderBackground(currentPage)

    console.log('>>> page Render!');
    // PDF Rendering
    this.renderingService.renderBackground(this.tmpCanvas, this.bgCanvas, currentPage);
  }


  /**
   * Background pre rendering
   * - Main bg를 그리기 전에 thumbnail image 기준으로 배경을 미리 그림.
   * - UI 측면의 효과
   * @param pageNum page 번호
   */
  async preRenderBackground(pageNum: number) {
    console.log(pageNum)
    const targetCanvas = this.bgCanvas

    const ctx = targetCanvas.getContext("2d")!;
    const imgElement: any = document.getElementById('thumb' + pageNum);

    /**************************************************
    * 처음 화이트보드에 들어오면 document.getElementById('thumb_' + pageNum) (이미지)가 정의되지 않아 오류가 난다.
    * 그래서 img가 null일 시 return 하여 오류 방지
    ****************************************************/
    if (imgElement == null) {
      return
    }

    ctx.drawImage(imgElement, 0, 0, targetCanvas.width, targetCanvas.height);
  }


  /**
   * 창 크기 변경시
   *
   */
  onResize() {
    if (!this.pdfInfo().pdfDocument) return console.log(this.pdfInfo().pdfDocument);

    // Resize시 container size 조절.
    const ratio = this.canvasService.setContainerSize(this.canvasContainer);

    this.containerSize.update(() => {
      return {
        ratio,
        coverWidth: this.canvasService.canvasFullSize.width,
      }
    })
  }

  /**
   * Scroll 발생 시
   */
  onScroll() {
    if (!this.pdfInfo().pdfDocument) return;

    this.containerScroll.update(() => {
      return {
        left: this.canvasContainer.scrollLeft,
        top: this.canvasContainer.scrollTop
      }
    })
  }


  /**
     * change Page : 아래 사항에 대해 공통으로 사용
     * - 최초 Load된 경우
     * - 페이지 변경하는 경우
     * - 문서 변경하는 경우
     * - scale 변경하는 경우
     */
  onChangePage() {

    console.log(`>> changePage to page: ${this.currentPage()}, scale: ${this.zoomScale()} `);

    // set Canvas Size
    const ratio = this.canvasService.setCanvasSize(this.currentPage(), this.zoomScale(), this.canvasContainer, this.bgCanvas);

    // BG & Board Render
    this.pageRender(this.currentPage(), this.zoomScale());

    // Thumbnail window 조정

    this.containerSize.update(() => {
      return {
        ratio,
        coverWidth: this.canvasService.canvasFullSize.width,
      }
    })

    // scroll bar가 있는 경우 page 전환 시 초기 위치로 변경
    this.canvasContainer.scrollTop = 0;
    this.canvasContainer.scrollLeft = 0;
  };

}