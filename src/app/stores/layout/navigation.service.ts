/**
 * Version 1.0
 * 파일명: navigation.service.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 네비게이션 내용 처리
 */

import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { sidenavRouteInfo } from 'src/app/config/sidenav-route-info';
import { NavigationCreateSpace, NavigationDropdown, NavigationItem, NavigationLink, NavigationSubheading } from 'src/app/interfaces/navigation-item.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  //아이템
  navItems = signal<NavigationItem[]>(sidenavRouteInfo)

  //드롭다운 아이템(현재 열려있는 아이템을 저장할 변수)
  openItems = signal<NavigationDropdown>({} as NavigationDropdown)

  constructor() { }

  /**
   * @description 링크 메뉴인지 판단하기 위한 함수
   * @param item 링크 네비게이션 아이템 
   * @type NavigationLink
   * @position /app/interfaces/navigation-item.interface.ts
   * @returns true | false
   */
  isLink(item: NavigationLink) {
    return item?.type === 'link'
  }

  /**
   * @description 드롭 다운 메뉴인지 판단하기 위한 함수
   * @param item 네비게이션 드롭다운 아이템 
   * @type NavigationDropdown
   * @position /app/interfaces/navigation-item.interface.ts
   * @returns true | false
   */
  isDropdown(item: NavigationDropdown) {
    return item?.type === 'dropdown'
  }

  /**
   * @description 부제목 메뉴인지 판단하기 위한 함수
   * @param item 네비게이션 서브 헤드 아이템
   * @type NavigationSubheading
   * @position /app/interfaces/navigation-item.interface.ts
   * @returns true | false
   */
  isSubheading(item: NavigationSubheading) {
    return item?.type === 'subheading'
  }

  /**
   * @description space 생성 메뉴인지 판단하기 위한 함수
   * @param item 네비게이션 스페이스 생성 아이템
   * @type NavigationCreateSpace
   * @position /app/interfaces/navigation-item.interface.ts
   * @returns true | false
   */
  isCreateSpace(item: NavigationCreateSpace) {
    return item?.type === 'click'
  }
}
