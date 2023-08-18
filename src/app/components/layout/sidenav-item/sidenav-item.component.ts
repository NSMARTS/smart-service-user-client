/**
 * Version 1.0
 * 파일명: sidenav-item.component.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 내비게이션 아이템 컴포넌트
 */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Signal, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
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
export class SidenavItemComponent implements OnInit{
  //상위 컴포넌트에서 넘어오는 아이템
  //any 사용 이유, 아래쪽에서 isLink, isDropdown, isSubheading을 사용해 타입을 분리하고 있음

  @Input() item!: any;

  //레벨, 얼마나 깊이 들어왔는지 파악하기 위함
  @Input() level: number = 0;

  //열려있는지 파악하기 위함
  isOpen: boolean = false;
  isActive: boolean = false;
  router = inject(Router)

  // navigationService 에서 isLink, isDropdown, isSubheading 꺼내서 사용
  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  isCreateSpace = this.navigationService.isCreateSpace;

  openItems: Signal<NavigationDropdown> = inject(NavigationService).openItems;
  openItems$ = toObservable(this.openItems)

  constructor(private navigationService: NavigationService) {

  }

  ngOnInit() :void {
    if(this.isDropdown(this.item)){
      this.openItems$.subscribe((item) => this.onOpenChange(item))
    }
  }

  /**
   * 
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
    console.log(item)
    // 1. 클릭한 메뉴가 내 자식일 경우
    if(this.isChildrenOf(this.item as NavigationDropdown, item as NavigationLink | NavigationDropdown)){
      return;
    }

    // 2. 클릭한 메뉴가 active한 child (Link)를 가지고 있는 경우
    if(this.hasActiveChilds(this.item as NavigationDropdown)) {
      return 
    }

    // 3. 현재내 dropdown에 대한 변경일 경우
    if(this.item === item) {
      return;
    }

    this.isOpen = false;
  }

  /**
   * 
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
   * 
   * @param parent 
   * @returns 
   */
  hasActiveChilds(parent: NavigationDropdown):any {
    return parent.children.some((child : any) => {
      if(this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if(this.isLink(child)) {
        return this.router.isActive(child.route as string, false);
      }
    })
  }
}
