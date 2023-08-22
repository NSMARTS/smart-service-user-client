import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { spaceGuard } from './space.guard';

describe('spaceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => spaceGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
