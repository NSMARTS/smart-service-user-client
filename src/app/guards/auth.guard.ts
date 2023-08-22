import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { DialogService } from '../services/dialog/dialog.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dialogService = inject(DialogService);
  
  const router = inject(Router);
  const routePath = route.routeConfig?.path ?? '';


  if(!authService.isAuthenticated()){
    dialogService.openDialogNegative('Please login first')
    router.navigate(['sign-in'])
    return true
  }else {
    return true;
  }

};
