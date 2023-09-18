/**
 * Version 1.0
 * 파일명: navigation-item.interface.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 사이드 내비게이션 타입 지정
 */

/**
 * @description 내비게이션 아이텝은 NavigationLink이거나 NavigationDropdown 이거나 NavigationSubheading 이거나 NavigationCreateSpace이다.
 */
export type NavigationItem = NavigationLink | NavigationDropdown | NavigationSubheading | NavigationCreateSpace;

/**
 * @description 내비게이션 서브 헤딩, 작은 제목
 */
export interface NavigationSubheading {
    type: 'subheading';
    label: string;
    children: Array<NavigationLink | NavigationDropdown | NavigationCreateSpace>
    isManager?: boolean
}

/**
 * @description 내비게이션 드롭다운
 */
export interface NavigationDropdown {
    type: 'dropdown';
    label: string;
    icon?: string;
    children: Array<NavigationLink | NavigationDropdown>;
    isManager?: boolean,
    isSuperManager?: boolean
}

/**
 * @description 링크
 */
export interface NavigationLink {
    type: 'link';
    route: string;
    fragment?: string;
    label: string;
    icon?: string;
    routerLinkActive?: { exact: boolean };
    isManager?: boolean;
    isReplacementDay?: boolean;
}

/**
 * @description 스페이스 생성
 */
export interface NavigationCreateSpace {
    type: 'click';
    label: string;
    icon?: string;
    isManager?: boolean;
}
