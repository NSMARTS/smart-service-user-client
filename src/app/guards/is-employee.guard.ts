import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from '../stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth/auth.service';


export const isEmployeeGuard: CanActivateFn = (route, state) => {
  const profileService: ProfileService = inject(ProfileService);
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  const userProfile$ = toObservable(profileService.userProfile);

  userProfile$.subscribe(() => {
    if (!authService.getTokenInfo().isManager && !authService.getTokenInfo().isSuperManager) {
      return true;
    }
    router.navigate(['main'])
    return false;
  })

  return true;
};
