import {Component, computed, effect, inject, signal} from '@angular/core';
import {CoreFacade} from '../../../../core/core.facade';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe} from '@angular/common';
import {SvgSafePipe} from '../../../../shared/pipes/svg-safe.pipe';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {MatDialog} from '@angular/material/dialog';
import {EmailEditModal} from '../../components/email-edit-modal/email-edit-modal';
import {httpResource} from '@angular/common/http';
import {environment} from '../../../../../../environments/environments';
import {VisitorAchievementsResponseDto} from '../../../../core/state/achievement/achievement.model';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, MatButtonModule, DatePipe, SvgSafePipe, AlertMessage],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private readonly coreFacade = inject(CoreFacade);
  private readonly dialog = inject(MatDialog);

  readonly visitor = this.coreFacade.visitor;
  readonly achievements = this.coreFacade.visitorAchievementsUnlock;
  readonly verificationTimeRemaining = signal<number | null>(null);

  readonly email = computed(() => this.visitor()?.email || '');

  private readonly achievementsResource = httpResource<VisitorAchievementsResponseDto>(() => ({
    url: `${environment.baseUrl}/visitor/achievements`,
    method: 'GET',
    withCredentials: true
  }));

  readonly progressPercentage = computed(() => {
    const data = this.achievements();
    if (!data) return 0;
    const total = data.unlocked.length + data.locked.length;
    return total > 0 ? Math.round((data.unlocked.length / total) * 100) : 0;
  });

  constructor() {
    effect(() => {
      const data = this.achievementsResource.value();
      if (data) {
        this.coreFacade.setVisitorAchievementsUnlock(data);
      }
    });

    effect(() => {
      const visitor = this.visitor();
      if (visitor && !visitor.isVerified && visitor.verificationExpiresAt) {
        this.startVerificationTimer(visitor.verificationExpiresAt);
      }
    });
  }

  private startVerificationTimer(expiryDate: Date) {
    const updateTimer = () => {
      const expiry = new Date(expiryDate).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

      this.verificationTimeRemaining.set(remaining);

      if (remaining > 0) {
        setTimeout(updateTimer, 1000);
      }
    };

    updateTimer();
  }

  formatTimeDetailed(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(', ');
  }

  openEmailEditModal() {
    const visitor = this.visitor();
    if (!visitor) return;

    this.dialog.open(EmailEditModal, {
      data: {currentEmail: visitor.email},
      autoFocus: false
    });
  }

  darkenColor(color: string): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darken = (c: number) => Math.max(0, Math.floor(c * 0.8));

    const darkR = darken(r).toString(16).padStart(2, '0');
    const darkG = darken(g).toString(16).padStart(2, '0');
    const darkB = darken(b).toString(16).padStart(2, '0');

    return `#${darkR}${darkG}${darkB}`;
  }

  getProgressBarColor(percentage: number): string {
    const thresholds = [
      {max: 20, class: 'bg-slate-500'},
      {max: 39, class: 'bg-gradient-to-r from-yellow-400 to-orange-400'},
      {max: 59, class: 'bg-gradient-to-r from-cyan-500 to-sky-400'},
      {max: 79, class: 'bg-gradient-to-r from-blue-500 to-indigo-500'},
      {max: 99, class: 'bg-gradient-to-r from-fuchsia-500 to-pink-500'},
      {max: 100, class: 'bg-green-500'}
    ];
    return thresholds.find(t => percentage <= t.max)?.class || 'bg-green-500';
  }
}
