import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const HasRoleGuard: CanActivateFn | CanMatchFn = (
  route: Route | ActivatedRouteSnapshot
) => {
  const allowedRoles = route.data?.['allowedRoles'];
  const authSvc = inject(AuthService).hasRole();
  const router = inject(Router);
  const verify = authSvc.includes(allowedRoles);
  return verify ? verify : router.navigate(['dashboard']);
};
