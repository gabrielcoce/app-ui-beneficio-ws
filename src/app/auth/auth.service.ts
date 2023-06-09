import { Injectable, inject } from '@angular/core';
import { Observable, ignoreElements, map, tap } from 'rxjs';
import { IAccessToken, User, UserWithToken } from './model/user.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginCredentials } from './model/login.credentials.interface';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { Role } from './model/roles.type';
import dayjs from 'dayjs';

const TOKEN_KEY = 'access_token';
const USER_NAME_KEY = 'user_name';
const ROLE_KEY = 'role';
const EXP_KEY = 'expires_in';
const URL_AUTH = environment.BASE_API + '/beneficio/auth';
const URL_TEST = environment.BASE_API + '/test';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);
  //constructor(private httpClient: HttpClient, private router: Router) {}
  login(credentials: LoginCredentials): Observable<never> {
    return this.httpClient.post<any>(URL_AUTH + '/signin', credentials).pipe(
      tap((userToken) => this.saveTokenToLocalStore(userToken.accessToken)),
      tap(() => this.redirectToDashboard()),
      ignoreElements()
    );
  }
  getTokenHcaptcha(captchaResponse: string) {
    return this.httpClient
      .get<IAccessToken>(`${URL_AUTH}/hc/${captchaResponse}`)
      .pipe(map((token: IAccessToken) => token.accessToken));
  }
  logout(): void {
    this.removeUserFromLocalStorage();
    this.router.navigateByUrl('/login');
  }
  isLoggedIn() {
    // console.log('local', localStorage.getItem(TOKEN_KEY) !== null);
    // console.log('token expire', this.isTokenExpire());
    return (localStorage.getItem(TOKEN_KEY) !== null && !this.isTokenExpire());
  }
  hasRole() {
    const role: Role[] = JSON.parse(localStorage.getItem(ROLE_KEY)!);
    return role;
  }
  name() {
    return localStorage.getItem(USER_NAME_KEY)!;
  }
  private redirectToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  private decodeToken(userToken: string): UserWithToken {
    const userInfo = jwt_decode(userToken) as User;
    return { ...userInfo, token: userToken };
  }

  private saveTokenToLocalStore(token: string): void {
    this.removeTokenLocalStorage();
    if (token) {
      const user = this.decodeToken(token);
      localStorage.setItem(TOKEN_KEY, user.token);
      localStorage.setItem(USER_NAME_KEY, user.username);
      localStorage.setItem(ROLE_KEY, JSON.stringify(user.role));
      const expires_in = (user.exp - 30) * 1000;
      localStorage.setItem(EXP_KEY, JSON.stringify(expires_in));
      //this.test().subscribe({next: (data=>{ console.log(data)})});
    }
  }
  private removeTokenLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EXP_KEY);
  }
  private removeUserFromLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EXP_KEY);
    window.location.reload();
  }

  private isTokenExpire() {
    const expires_in = localStorage.getItem(EXP_KEY);
    return expires_in
      ? dayjs(Date.now()).isSameOrAfter(parseInt(expires_in))
      : false;
  }

  test() {
    return this.httpClient.get(URL_TEST + '/all', {
      responseType: 'text' || 'json',
    });
  }
}
