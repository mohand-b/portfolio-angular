import {inject, Injectable, Signal} from '@angular/core';
import {AdminService} from './state/admin/admin.service';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {VisitorService} from './state/visitor/visitor.service';
import {AdminAuthDto, AdminAuthResponseDto} from './state/admin/admin.model';
import {AdminStore} from './state/admin/admin.store';

@Injectable({providedIn: 'root'})
export class CoreFacade {

  private adminService = inject(AdminService);
  private visitorService = inject(VisitorService);

  private adminStore = inject(AdminStore);

  readonly canAccessAdmin: Signal<boolean> = this.adminStore.canAccessAdmin;
  readonly mustLogin: Signal<boolean> = this.adminStore.mustLogin;
  readonly isLoading: Signal<boolean> = this.adminStore.isLoading;

  // AUTH ADMIN

  loginAdmin(authDto: AdminAuthDto): Observable<AdminAuthResponseDto> {
    this.adminStore.setSessionStatus('checking');
    return this.adminService.login(authDto).pipe(
      tap(() => {
        this.adminStore.setSessionStatus('authenticated');
      }),
      catchError((err) => {
        this.adminStore.setSessionStatus('unauthenticated', err.message);
        return throwError(() => err);
      })
    );
  }

  revokeAdminToken(): Observable<{ message: string }> {
    return this.adminService.revokeToken();
  }

  logoutAdmin(): Observable<any> {
    return this.adminService.logout().pipe(
      tap(() => this.adminStore.setSessionStatus('unauthenticated')),
      catchError((err) => {
        this.adminStore.setError(err.message);
        return throwError(() => err);
      })
    );
  }

  checkAdminSession(): Observable<any> {
    this.adminStore.setSessionStatus('checking');
    return this.adminService.checkSession().pipe(
      tap(() => this.adminStore.setSessionStatus('authenticated')),
      catchError((err) => {
        this.adminStore.setSessionStatus('unauthenticated', err.message);
        return throwError(() => err);
      })
    );
  }

}
