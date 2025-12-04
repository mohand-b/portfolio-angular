import {inject, Injectable, Signal} from '@angular/core';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {AdminAuthDto, AdminAuthResponseDto} from './state/admin/admin.model';
import {AdminService} from './state/admin/admin.service';
import {AdminStore} from './state/admin/admin.store';
import {VisitorAuthDto, VisitorAuthResponseDto, VisitorDto} from './state/visitor/visitor.model';
import {VisitorService} from './state/visitor/visitor.service';
import {VisitorStore} from './state/visitor/visitor.store';
import {SkillStore} from '../routes/skills/state/skill/skill.store';
import {SkillDto} from '../routes/skills/state/skill/skill.model';
import {VisitorAchievementsResponseDto} from './state/achievement/achievement.model';

type AchievementsInfo = { unlocked: number; total: number; percentCompletion: number };

@Injectable({providedIn: 'root'})
export class CoreFacade {

  private adminService = inject(AdminService);
  private adminStore = inject(AdminStore);
  private visitorService = inject(VisitorService);
  private visitorStore = inject(VisitorStore);
  private skillStore = inject(SkillStore);

  readonly canAccessAdmin: Signal<boolean> = this.adminStore.canAccessAdmin;
  readonly isLoading: Signal<boolean> = this.adminStore.isLoading;
  readonly isVisitorAuthenticated: Signal<boolean> = this.visitorStore.isAuthenticated;
  readonly isVisitorVerified: Signal<boolean> = this.visitorStore.isVerified;
  readonly visitor: Signal<VisitorDto | null> = this.visitorStore.visitor;
  readonly visitorFullName: Signal<string | null> = this.visitorStore.fullName;
  readonly visitorAchievements: Signal<AchievementsInfo | null> = this.visitorStore.achievements;
  readonly visitorAchievementsUnlock: Signal<VisitorAchievementsResponseDto | null> = this.visitorStore.achievementsUnlockSorted;
  readonly visitorVerificationMessage: Signal<string | null> = this.visitorStore.verificationMessage;
  readonly skills: Signal<SkillDto[]> = this.skillStore.skills;

  constructor() {
    this.skillStore.fetchSkills();
  }

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

  revokeAdminToken(): Observable<{ message: string }> {
    return this.adminService.revokeToken();
  }

  checkAdminSession(): Observable<{ isValid: boolean }> {
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
      tap((response) => {
        this.visitorStore.setVisitor(response);
      })
    );
  }

  checkVisitorSession(): Observable<VisitorDto> {
    return this.visitorService.getMe().pipe(
      tap((visitor) => this.visitorStore.setVisitor(visitor)),
      catchError((err) => {
        this.visitorStore.clear();
        return throwError(() => err);
      })
    );
  }

  verifyEmail(token: string): Observable<VisitorAuthResponseDto> {
    return this.visitorService.verifyEmail(token).pipe(
      tap((response) => this.visitorStore.setVisitor(response)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  unlockAchievement(code: string): Observable<{ success: boolean; message: string }> {
    return this.visitorService.unlockAchievement(code);
  }

  setVisitorAchievementsUnlock(achievements: VisitorAchievementsResponseDto | null) {
    this.visitorStore.setAchievementsUnlock(achievements);
  }

  updateVisitorEmail(email: string): Observable<{ message: string }> {
    return this.visitorService.updateEmail(email).pipe(
      tap(() => this.visitorStore.updateEmail(email))
    );
  }

  updateVisitorAvatar(avatarSvg: string): Observable<{ message: string }> {
    return this.visitorService.updateAvatar(avatarSvg).pipe(
      tap(() => {
        const currentVisitor = this.visitorStore.visitor();
        if (currentVisitor) {
          this.visitorStore.setVisitor({
            ...currentVisitor,
            avatarSvg
          });
        }
      })
    );
  }

  setVisitor(visitor: VisitorDto): void {
    this.visitorStore.setVisitor(visitor);
  }
}
