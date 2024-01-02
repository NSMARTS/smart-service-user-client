/**
 * Version 1.0
 * 파일명: layout.components.ts
 * 작성일시: 2023-08-17
 * 작성자: 임호균
 * 설명: 레이아웃 구성
 */

import { Component, DestroyRef, HostListener, Injector, OnDestroy, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidenavService } from 'src/app/stores/layout/sidenav.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { LogService } from 'src/app/services/log/log.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MaterialsModule,
    SidenavComponent,
    ToolbarComponent,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss', '../../../styles.scss']
})
export class LayoutComponent implements OnDestroy {
  isDesktop: Signal<boolean> = inject(SidenavService).isDesktop;
  isSideNavOpen: Signal<boolean> = inject(SidenavService).isSideNavOpen;
  isSideNavOpen$ = toObservable(this.isSideNavOpen)

  // 의존성 주입
  router = inject(Router)
  destroyRef = inject(DestroyRef);
  logService = inject(LogService);
  authService = inject(AuthService);
  userInfo = this.authService.getTokenInfo()

  //변수
  prevUrl: string = this.router.url; // 새로고침 시 첫 url
  enterTime: string = '';
  leaveTime: string = '';

  @ViewChild('sidenav', { static: true })
  sidenav!: MatSidenav;

  constructor(private sidenavService: SidenavService) {
    this.sidenavService.isDesktop.set(window.innerWidth > 1280)
    this.isSideNavOpen$.subscribe(() => {
      if (this.isSideNavOpen()) {
        this.sidenav.open()
      }
    });

    // 처음 사이트에 접근 or 새로고침 시 시간기록
    this.enterTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // url navigation
    this.router.events
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        // 이전 url가 현재 url이 같지 않으면 (다른 페이지로 이동하면)
        if (this.prevUrl !== event.urlAfterRedirects) {
          this.createLog(event.urlAfterRedirects);
        }
      }

      );
  }

  ngOnDestroy(): void {
    // 페이지에서 나가거나, 새로고침 시 로그 남기기
    this.createLog(this.prevUrl)
  }

  /**
   * 로그 남기는 api
   * url이 변경되거나 새로고침 or 컴포넌트가 사라졌을 시(onDestroy) api 요청 
   * 이전 url 주소, 회사, 유저정보, 입장시간, 나간시간 기록 (머문 페이지 시간 정보 기록)
   */
  createLog(currentUrl: string) {
    this.leaveTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const body = {
      user: this.userInfo._id,
      company: this.userInfo.company,
      isManager: this.userInfo.isManager,
      url: this.prevUrl,
      enterTime: this.enterTime,
      leaveTime: this.leaveTime,
    }

    // 로그남기는 api 요청
    this.logService.createLog(body).subscribe({
      error: (err) => console.error('Error logging navigation', err),
      complete: () => {
        // api 요청 후 현재 url, 떠난 시간을 이전 url, 입장시간으로 변경 
        this.enterTime = this.leaveTime;
        this.prevUrl = currentUrl;

      }
    })
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
