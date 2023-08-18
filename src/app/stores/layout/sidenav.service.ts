/**
 * Version 1.0
 * 파일명: layout.components.ts
 * 작성일시: 2023-08-17
 * 작성자: 임호균
 * 설명: 사이드 네비게이션 1280px 기준으로 사라지는 것 처리
 */


import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  isDesktop = signal<boolean>(false)
  isDesktop$ = toObservable(this.isDesktop);
  isSideNavOpen = signal<boolean>(false)

  constructor() { 
    this.isDesktop$.subscribe(() => {
      this.isSideNavOpen.set(false)
    })
  }

  openSidenav() {
    this.isSideNavOpen.set(true);
  }

  closeSidenav() {
    this.isSideNavOpen.set(false);
  }
}
