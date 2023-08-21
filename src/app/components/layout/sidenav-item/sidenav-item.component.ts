/**
 * Version 1.0
 * 파일명: sidenav-item.component.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 내비게이션 아이템 컴포넌트
 */

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnChanges, OnDestroy, OnInit, Signal, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter, takeUntil } from 'rxjs';
import { dropdownAnimation } from 'src/app/animations/dropdown.animation';
import { NavigationDropdown, NavigationItem, NavigationLink, NavigationSubheading } from 'src/app/interfaces/navigation-item.interface';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { NavigationService } from 'src/app/stores/layout/navigation.service';

@Component({
  selector: 'sidenav-item',
  standalone: true,
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    SidenavItemComponent,
  ],
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  animations: [dropdownAnimation
  ]
})
export class SidenavItemComponent implements OnInit, OnChanges, OnDestroy{
  //상위 컴포넌트에서 넘어오는 아이템
  //any 사용 이유, 아래쪽에서 isLink, isDropdown, isSubheading을 사용해 타입을 분리하고 있음

  @Input() item!: any;

  //레벨, 얼마나 깊이 들어왔는지 파악하기 위함
  @Input() level: number = 0;

  //열려있는지 파악하기 위함
  isOpen: boolean = false;
  isActive: boolean = false;
  
  router = inject(Router)
  
  subscriptions: Subscription | undefined;

  // navigationService 에서 isLink, isDropdown, isSubheading 꺼내서 사용
  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  isCreateSpace = this.navigationService.isCreateSpace;

  openItems: Signal<NavigationDropdown> = inject(NavigationService).openItems;
  openItems$ = toObservable(this.openItems)

  constructor(private navigationService: NavigationService) {}

  ngOnInit() :void {
    this.subscriptions = new Subscription();
    if(this.isDropdown(this.item)){
      const sub1 = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(() => this.onRouteChange());
      
      this.openItems$.subscribe((item) => this.onOpenChange(item))

      this.subscriptions.add(sub1)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('item') && this.isDropdown(this.item)) { 
      // this.item -> changes.item.currentValue로 해도 됩
      this.onRouteChange();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions!.unsubscribe();
  }

  /**
   * @description toggle 함수
   */
  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.navigationService.openItems.set(this.item as NavigationDropdown)
  }



  /**
   * @description 드롭다운 되었을 경우 다른 드롭다운 메뉴들은 닫혀야 한다.
   * @param item 
   */
  onOpenChange(item: NavigationDropdown) {
    // 1. 클릭한 메뉴가 내 자식일 경우
    if(this.isChildrenOf(this.item as NavigationDropdown, item as NavigationLink | NavigationDropdown)){
      return;
    }

    // 2. 클릭한 메뉴가 active한 child (Link)를 가지고 있는 경우
    if(this.hasActiveChilds(this.item as NavigationDropdown)) {
      return;
    }

    // 3. 현재내 dropdown에 대한 변경일 경우
    if(this.item === item) {
      return;
    }

    this.isOpen = false;
  }

  /**
   * @작성자 임호균
   * @작성일 2023-08-21
   * @description Route change가 발생한 경우 
   * - dropdown menu의 item일 경우에만 실행
   * - route 변경이 발생한 경우 
   * - 1. 하위 자식 중 active가 존재 (현재 routing에 해당): dropdown 열기, active 설정]
   * - 2. 하위 자식 중 active가 없음: dropdown 닫기
   */
  onRouteChange() {
    // 내 하위 Menu에 active child가 있는 경우
    if(this.hasActiveChilds(this.item as NavigationDropdown)) {
      this.isActive = true;
      this.isOpen = true;
      this.navigationService.openItems.set(this.item as NavigationDropdown)
    }
    // 내 하위 Menu에 active child가 없는 경우
    else {
      this.isActive = false;
      this.isOpen = false;
      this.navigationService.openItems.set(this.item as NavigationDropdown)
    } 
  }

  /**
   * @description 클릭한 메뉴가 내 자식일 경우
   * @param parent 
   * @param item 
   */
  isChildrenOf(parent: NavigationDropdown, item: NavigationLink | NavigationDropdown): any {
    if(parent.children.indexOf(item) !== -1) {
      return true;
    }
    return parent.children
    .filter((child: NavigationLink | NavigationDropdown) => this.isDropdown(child as NavigationDropdown))
    .filter((child: NavigationLink | NavigationDropdown) => this.isChildrenOf(child as NavigationDropdown, item)).length
  }

  /**
   * this.router.isActive를 사용하려는데 에러 발생해서 chat-gpt에 물어봐서 나온 답변
   */
  isActiveOptions: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  /**
   * @description 클릭한 메뉴가 active한 child (Link)를 가지고 있는 경우
   * @param parent 
   * @returns 
   */
  hasActiveChilds(parent: NavigationDropdown):any {
    return parent.children.some((child : any) => {
      if(this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if(this.isLink(child)) {
        return this.router.isActive(child.route as string, this.isActiveOptions);
      }
    })
  }
}
