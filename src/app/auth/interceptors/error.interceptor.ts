import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        if (httpError.status === 406) {
          //console.error('httpError', httpError.error.message);
          return of(
            new HttpResponse({
              status: 200,
              body: httpError.error.message,
            })
          );
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
