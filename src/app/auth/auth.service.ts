import { Injectable, inject } from '@angular/core';
import { Observable, ignoreElements, tap } from 'rxjs';
import { User, UserWithToken } from './model/user.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginCredentials } from './model/login.credentials.interface';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { Role } from './model/roles.type';

const TOKEN_KEY = 'access_token';
const TOKEN_KEY_HC = 'access_token_hc';
const USER_NAME_KEY = 'user_name';
const ROLE_KEY = 'role';
const EXP_KEY = 'expires_in';
const EXP_KEY_HC = 'expires_in_hc';
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
  logout(): void {
    this.removeUserFromLocalStorage();
    this.router.navigateByUrl('/login');
  }
  isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) != null && this.isTokenExpire();
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
    if (token) {
      const user = this.decodeToken(token);
      localStorage.setItem(TOKEN_KEY, user.token);
      localStorage.setItem(USER_NAME_KEY, user.username);
      localStorage.setItem(ROLE_KEY, JSON.stringify(user.role));
      const expires_in = user.exp - 30;
      localStorage.setItem(EXP_KEY, JSON.stringify(expires_in));
      //this.test().subscribe({next: (data=>{ console.log(data)})});
    }
  }

  private saveTokenToLocalStoreHc(token: string): void {
    if (token) {
      const user = this.decodeToken(token);
      localStorage.setItem(TOKEN_KEY_HC, user.token);
      const expires_in = user.exp - 30;
      localStorage.setItem(EXP_KEY_HC, JSON.stringify(expires_in));
      //this.test().subscribe({next: (data=>{ console.log(data)})});
    }
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
    return (
      expires_in === null || // no existe variable
      parseInt(expires_in) <= new Date().getTime()
    ); // o token vencido
  }

  private isTokenExpireHc() {
    const expires_in = localStorage.getItem(EXP_KEY_HC);
    return (
      expires_in === null || // no existe variable
      parseInt(expires_in) <= new Date().getTime()
    ); // o token vencido
  }

  test() {
    return this.httpClient.get(URL_TEST + '/all', {
      responseType: 'text' || 'json',
    });
  }
}
