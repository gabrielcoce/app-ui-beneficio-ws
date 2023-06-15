import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { User, UserWithToken } from '../model/user.interface';
import jwt_decode from 'jwt-decode';
const TOKEN_KEY = 'access_token_hc';
const EXP_KEY = 'expires_in_hc';

@Component({
  selector: 'app-hcaptcha',
  templateUrl: './hcaptcha.component.html',
  styleUrls: ['./hcaptcha.component.scss'],
})
export class HcaptchaComponent {
  constructor(
    private dialogRef: MatDialogRef<HcaptchaComponent>,
    private readonly authSvc: AuthService
  ) {
    this.dialogRef.disableClose = true;
  }
  onVerify(token: string) {
    //console.log('token', token);
    let accessToken: string = '';
    this.authSvc.getTokenHcaptcha(token).subscribe({
      next: (data) => {
        console.log(data);
        accessToken = data;
        this.saveTokenToLocalStore(accessToken);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Get Token HC Finished');
        return this.dialogRef.close(accessToken);
      },
    });
  }
  onExpired(response: any) {
    // The verification expired.
    console.info(response);
  }
  onError(error: any) {
    // An error occured during the verification process.
    console.error(error);
  }
  private decodeToken(userToken: string): UserWithToken {
    const userInfo = jwt_decode(userToken) as User;
    return { ...userInfo, token: userToken };
  }
  private saveTokenToLocalStore(token: string): void {
    this.removeUserFromLocalStorage();
    if (token) {
      const user = this.decodeToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      const expires_in = user.exp - 30;
      localStorage.setItem(EXP_KEY, JSON.stringify(expires_in));
    }
  }
  private removeUserFromLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
  }
}
