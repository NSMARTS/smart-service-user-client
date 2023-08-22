import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Inject } from '@angular/core';

export const managerGuard: CanActivateFn = (route, state) => {
  const authService = Inject(AuthService);
  const router = Inject(Router);
  
  const managerFlag: boolean = authService.getTokenInfo().isManager;

  if(!managerFlag) {
    router.navigate(['main'])
    return true;
  }else{
    return true;
  }
};
