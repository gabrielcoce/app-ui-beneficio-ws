import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Role } from '../model/roles.type';

export const IsLoggedInGuard: CanMatchFn = () => {
  const authSvc = inject(AuthService).isLoggedIn();
  const router = inject(Router);
  return authSvc ? authSvc : router.navigate(['login']);
};