import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from '../stores/profile/profile.service';
import { toObservable } from '@angular/core/rxjs-interop';


export const myManagerGuard: CanActivateFn = (route, state) => {
  const profileService: ProfileService = inject(ProfileService);
  const router = inject(Router);
  const userProfile$ = toObservable(profileService.userProfile);

  userProfile$.subscribe(() => {
    if(profileService.userProfile().profileData?.user && profileService.userProfile().profileData.user.isManager) {
      return true;
    }
    router.navigate(['main'])
    return false;
  })

  return true;
};
