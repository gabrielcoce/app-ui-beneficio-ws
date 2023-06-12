import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const IsLoggedInGuard: CanMatchFn = () => {
  const authSvc = inject(AuthService).isLoggedIn();
  const router = inject(Router);
  return authSvc ? authSvc : router.navigate(['login']);
};