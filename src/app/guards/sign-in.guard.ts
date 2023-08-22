import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const signInGuard: CanActivateFn = (route, state) => {
  // 토큰 만료 혹은 종료 시 login page로 돌아감.
  const authService = inject(AuthService);
  const router = inject(Router);
  const routePath = route.routeConfig?.path ?? '';
  if(!authService.isAuthenticated()) {
    if (['welcome', 'sign-in', 'sign-up', 'find-pw'].includes(routePath)) {
      return true;
    } else if (routePath === '' && state.url === '/main') {
      router.navigate(['welcome']);
    } else {
      router.navigate(['sign-in'], { queryParams: { 'redirectURL': state.url } });
    }
    return true;
  } else {
    if(['sign-in', 'welcome', 'find-pw', 'sign-up'].includes(routePath)) {
      router.navigate(['main'])
    }
    return true;
  }
};
