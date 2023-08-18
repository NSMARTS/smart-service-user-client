/**
 * Version 1.0
 * 파일명: dropdown.animation.ts
 * 작성일시: 2023-08-17
 * 작성자: 임호균
 * 설명: 드롭다운 애니메이션
 */

//https://angular.kr/guide/transition-and-triggers 
import {trigger, state, style, transition, animate} from '@angular/animations';

export const dropdownAnimation = trigger('dropdown', [
    state('closed', style({
        height: 0,
        opacity: 0
    })),
    state('open', style({
        height: '*',
        opacity: 1
    })),
    transition('closed <=> open', animate('300ms ease'))
])