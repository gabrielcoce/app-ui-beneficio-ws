import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, of, throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        //console.error('httpError', httpError);
        if (httpError.status === 406) {
          //console.error('httpError', httpError.error.message);
          return of(
            new HttpResponse({
              status: 200,
              body: httpError.error.message,
            })
          );
        }
        if (
          httpError.status === 401 &&
          httpError.error.message === 'Unauthorized'
        ) {
          //console.error('httpError', httpError.error.message);
          localStorage.clear();
          window.location.href = window.location.href;
          return EMPTY;
        }
        return throwError(() => httpError.error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}
export const errorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
