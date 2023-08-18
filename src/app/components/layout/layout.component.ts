/**
 * Version 1.0
 * 파일명: layout.components.ts
 * 작성일시: 2023-08-17
 * 작성자: 임호균
 * 설명: 레이아웃 구성
 */

import { Component, HostListener, Injector, Signal, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { SidenavService } from 'src/app/stores/layout/sidenav.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MaterialsModule,
    SidenavComponent,
    ToolbarComponent,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss', '../../../styles.scss']
})
export class LayoutComponent {
  isDesktop: Signal<boolean> = inject(SidenavService).isDesktop;
  isSideNavOpen: Signal<boolean> = inject(SidenavService).isSideNavOpen;
  isSideNavOpen$ = toObservable(this.isSideNavOpen)

  @ViewChild('sidenav', { static: true })
  sidenav!: MatSidenav;
  
  constructor(private sidenavService: SidenavService) {
    this.sidenavService.isDesktop.set(window.innerWidth > 1280)
    this.isSideNavOpen$.subscribe(() => {
      if(this.isSideNavOpen()){
        this.sidenav.open()
      }
    });
  }

  /**
   * @description 화면의 사이즈 변화를 감지하여 side nav 상태 변경
   * @param event 이벤트 파라미터
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.sidenavService.isDesktop.set(window.innerWidth > 1280)
  }


  /**
   * @description 사이드바 닫는 함수 backdropClick 이벤트 시 실행
   * 작성일: 2023-08-18
   * 작성자: 임호균
   */
  closeEvent() {
    this.sidenavService.closeSidenav()
  }
}
