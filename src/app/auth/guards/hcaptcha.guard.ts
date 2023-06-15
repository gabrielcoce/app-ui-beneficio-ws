import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanMatchFn } from '@angular/router';
import { HcaptchaComponent } from '../hcaptcha/hcaptcha.component';
import { map } from 'rxjs';
import dayjs from 'dayjs';
const TOKEN_KEY = 'access_token_hc';
const EXP_KEY = 'expires_in_hc';
export const HcaptchaGuard: CanMatchFn = () => {
  const dialog = inject(MatDialog);
  window.scrollTo(0, 0);
  if (!localStorage.getItem(TOKEN_KEY) || isTokenExpire()) {
    return dialog
      .open(HcaptchaComponent)
      .beforeClosed()
      .pipe(map((value) => typeof value === 'string'));
  }
  return true;
};

const isTokenExpire = () => {
  const expires_in = localStorage.getItem(EXP_KEY);
  return expires_in
    ? dayjs(parseInt(expires_in)).isSameOrAfter(Date.now())
    : false;
};
