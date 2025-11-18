import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {CoreFacade} from '../core.facade';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const coreFacade = inject(CoreFacade);
  const router = inject(Router);

  return next(req.clone({withCredentials: true})).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAdminRequest = req.url.includes('/admin/');
      const isLoginOrRefresh = req.url.includes('/admin/login') || req.url.includes('/admin/refresh-token');

      if (error.status === 401 && isAdminRequest && !isLoginOrRefresh) {
        return coreFacade.revokeAdminToken().pipe(
          switchMap(() => next(req.clone({withCredentials: true}))),
          catchError((refreshError) => {
            return coreFacade.logoutAdmin().pipe(
              switchMap(() => {
                router.navigate(['/console/login']);
                return throwError(() => refreshError);
              }),
              catchError(() => {
                router.navigate(['/console/login']);
                return throwError(() => refreshError);
              })
            );
          })
        );
      }
      return throwError(() => error);
    })
  );
}
