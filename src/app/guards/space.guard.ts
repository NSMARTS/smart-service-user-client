import { CanActivateFn } from '@angular/router';

export const spaceGuard: CanActivateFn = (route, state) => {
  return true;
};
