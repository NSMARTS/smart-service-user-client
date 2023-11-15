/**
 * Version 1.0
 * 파일명: sidenav-route-info.ts
 * 작성일시: 2023-08-18
 * 작성자: 임호균
 * 설명: 사이드 네비게이션 목록 초기 설정
 */

import { NavigationItem } from "../interfaces/navigation-item.interface";
export const sidenavRouteInfo: NavigationItem[] = [
  // dashboard
  {
    type: 'link',
    label: 'Dashboard',
    route: '/main',
    icon: 'dashboard'
  },
  {
    type: 'subheading',
    label: 'SPACE',
    children: [
      {
        type: 'link',
        label: 'notification',
        route: '/notification',
        icon: 'campaign'
      },
      {
        type: 'link',
        label: 'meeting',
        route: '/meeting',
        icon: 'groups'
      }
    ]
  },
  // // project
  // {
  //     type: 'subheading',
  //     label: 'PROJECT',
  //     children: [
  //         {
  //             type: 'click',
  //             label: 'Create Space',
  //             icon: 'create_new_folder',
  //         },
  //         {
  //             type: 'dropdown',
  //             label: 'Space',
  //             icon: 'library_books',
  //             isManager: false,
  //             children: [

  //             ]
  //         }
  //     ]
  // },
  // Leave
  {
    type: 'subheading',
    label: 'LEAVE',
    children: [
      {
        type: 'dropdown',
        label: 'Leave Management',
        icon: 'event_available',
        isManager: false,
        children: [
          {
            type: 'link',
            label: 'My Leave Status',
            route: '/leave/my-status',
            icon: 'fact_check',
            isManager: false,
            isReplacementDay: false
          },
          {
            type: 'link',
            label: 'Leave Request',
            route: '/leave/leave-request-list',
            icon: 'event_note',
            isManager: false,
            isReplacementDay: false,
          },
          {
            type: 'link',
            label: 'Replacement Day Request',
            route: '/leave/rd-request-list',
            icon: 'date_range',
            isManager: false,
            isReplacementDay: true
          }
        ]
      },
      {
        type: 'dropdown',
        label: 'Employee Management',
        icon: 'groups',
        isManager: true,
        children: [
          {
            type: 'link',
            label: 'Employee Leave Status',
            route: '/employee-management/employee-leave-status',
            icon: 'update',
            isManager: true,
            isReplacementDay: false
          },
          {
            type: 'link',
            label: 'Employee List',
            route: '/employee-management/employee-list',
            icon: 'format_list_bulleted',
            isManager: true,
            isReplacementDay: false
          },
          // {
          //     type: 'link',
          //     label: 'Employee Leave Request',
          //     route: '/employee-management/leave-request',
          //     icon: 'request_quote',
          //     isManager: true,
          //     isReplacementDay: false
          // },
          {
            type: 'link',
            label: 'RD Confirming Request',
            route: '/employee-management/employee-rd-request',
            icon: 'recommend',
            isManager: true,
            isReplacementDay: false
          },
          // {
          //     type: 'link',
          //     label: 'Employee Register Request',
          //     route: '/employee-management/register-request',
          //     icon: 'how_to_reg',
          //     isManager: true,
          //     isReplacementDay: false 
          // }
        ]
      },

    ]
  },
  {
    type: 'subheading',
    label: 'Contracts',
    children: [{
      type: 'dropdown',
      label: 'Contract Management',
      icon: 'manage_search',
      isManager: false,
      children: [{
        type: 'link',
        label: 'Contract List',
        route: '/contract-management/contract',
        icon: 'format_list_bulleted',
        isManager: true,
        isReplacementDay: false
      }, {
        type: 'link',
        label: 'Payment Statement List',
        route: '/contract-management/pay-stubs',
        icon: 'format_list_bulleted',
        isManager: true,
        isReplacementDay: false
      }]
    },
    {
      type: 'dropdown',
      label: 'Contract Management',
      icon: 'manage_search',
      isSuperManager: true,
      children: [{
        type: 'link',
        label: 'Contract List',
        route: '/contract-management/manager-contract',
        icon: 'format_list_bulleted',
        isManager: true,
        isReplacementDay: false
      }, {
        type: 'link',
        label: 'Payment Statement List',
        route: '/contract-management/manager-pay-stubs',
        icon: 'format_list_bulleted',
        isManager: true,
        isReplacementDay: false
      },]
    }
    ]
  },
]