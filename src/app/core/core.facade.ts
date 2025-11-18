import {inject, Injectable, Signal} from '@angular/core';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {AdminAuthDto, AdminAuthResponseDto} from './state/admin/admin.model';
import {AdminService} from './state/admin/admin.service';
import {AdminStore} from './state/admin/admin.store';
import {Visitor, VisitorAuthDto, VisitorAuthResponseDto} from './state/visitor/visitor.model';
import {VisitorService} from './state/visitor/visitor.service';
import {VisitorStore} from './state/visitor/visitor.store';

type AchievementsInfo = {unlocked: number; total: number; percentCompletion: number};

@Injectable({providedIn: 'root'})
export class CoreFacade {

  private adminService = inject(AdminService);
  private adminStore = inject(AdminStore);
  private visitorService = inject(VisitorService);
  private visitorStore = inject(VisitorStore);

  readonly canAccessAdmin: Signal<boolean> = this.adminStore.canAccessAdmin;
  readonly mustLogin: Signal<boolean> = this.adminStore.mustLogin;
  readonly isLoading: Signal<boolean> = this.adminStore.isLoading;
  readonly isVisitorAuthenticated: Signal<boolean> = this.visitorStore.isAuthenticated;
  readonly visitorFullName: Signal<string | null> = this.visitorStore.fullName;
  readonly visitorAchievements: Signal<AchievementsInfo | null> = this.visitorStore.achievements;

  loginAdmin(authDto: AdminAuthDto): Observable<AdminAuthResponseDto> {
    this.adminStore.setSessionStatus('checking');
    return this.adminService.login(authDto).pipe(
      tap(() => this.adminStore.setSessionStatus('authenticated')),
      catchError((err) => {
        this.adminStore.setSessionStatus('unauthenticated', err.message);
        return throwError(() => err);
      })
    );
  }

  revokeAdminToken(): Observable<{message: string}> {
    return this.adminService.revokeToken();
  }

  logoutAdmin(): Observable<{message: string}> {
    return this.adminService.logout().pipe(
      tap(() => this.adminStore.setSessionStatus('unauthenticated')),
      catchError((err) => {
        this.adminStore.setError(err.message);
        return throwError(() => err);
      })
    );
  }

  checkAdminSession(): Observable<{isValid: boolean}> {
    this.adminStore.setSessionStatus('checking');
    return this.adminService.checkSession().pipe(
      tap(() => this.adminStore.setSessionStatus('authenticated')),
      catchError((err) => {
        this.adminStore.setSessionStatus('unauthenticated', err.message);
        return throwError(() => err);
      })
    );
  }

  authenticateVisitor(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.visitorService.authenticate(authDto).pipe(
      tap((visitor) => this.visitorStore.setVisitor(visitor))
    );
  }

  checkVisitorSession(): Observable<Visitor> {
    return this.visitorService.getMe().pipe(
      tap((visitor) => this.visitorStore.setVisitor(visitor)),
      catchError((err) => {
        this.visitorStore.clear();
        return throwError(() => err);
      })
    );
  }

  logoutVisitor(): void {
    this.visitorStore.clear();
  }

}
