import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
const TOKEN_KEY = 'access_token';
const ENDPOINT_SEC_AUTH = 'auth';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes(ENDPOINT_SEC_AUTH)) return next.handle(request);
    if (!this.authSvc.isLoggedIn()) {
      window.location.reload();
      return next.handle(request);
    }
    return next.handle(this.addAccessToken(request));
  }

  private addAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    //console.info('add token from localStorage -->', accessToken);
    //console.log('method', request.method);
    const newRequest = request;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      // 'Access-Control-Allow-Headers': 'Content-Type',
      Accept: 'application/json',
    });
    if (accessToken) {
      return newRequest.clone({ headers });
    }
    return newRequest;
  }
}

export const authTokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
