import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AdminService} from '../state/admin/admin.service';
import {AdminStore} from '../state/admin/admin.store';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const adminService = inject(AdminService);
  const adminStore = inject(AdminStore);
  const router = inject(Router);

  return next(req.clone({withCredentials: true})).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAdminRequest = req.url.includes('/admin/');
      const isLoginOrRefresh = req.url.includes('/admin/login') || req.url.includes('/admin/refresh-token');

      if (error.status === 401 && isAdminRequest && !isLoginOrRefresh) {
        return adminService.revokeToken().pipe(
          switchMap(() => next(req.clone({withCredentials: true}))),
          catchError((refreshError) => {
            return adminService.logout().pipe(
              tap(() => adminStore.setSessionStatus('unauthenticated')),
              switchMap(() => {
                router.navigate(['/console/login']);
                return throwError(() => refreshError);
              }),
              catchError(() => {
                adminStore.setSessionStatus('unauthenticated');
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
