import {Component, inject} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToastService} from '../../services/toast.service';
import {MatIconModule} from '@angular/material/icon';
import {AchievementIconComponent} from '../achievement-icon/achievement-icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

@Component({
  selector: 'app-toast-container',
  imports: [MatIconModule, NgClass, AchievementIconComponent],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  getToastConfig(type: ToastType) {
    const configs: Record<ToastType, { bgClass: string; icon: string; iconClass: string; progressClass: string }> = {
      success: {
        bgClass: 'toast-success',
        icon: 'check_circle',
        iconClass: 'toast-success-icon',
        progressClass: 'toast-success-progress'
      },
      error: {
        bgClass: 'toast-error',
        icon: 'error',
        iconClass: 'toast-error-icon',
        progressClass: 'toast-error-progress'
      },
      warning: {
        bgClass: 'toast-warning',
        icon: 'warning',
        iconClass: 'toast-warning-icon',
        progressClass: 'toast-warning-progress'
      },
      info: {bgClass: 'toast-info', icon: 'info', iconClass: 'toast-info-icon', progressClass: 'toast-info-progress'},
      achievement: {
        bgClass: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
        icon: 'emoji_events',
        iconClass: 'text-amber-500',
        progressClass: 'bg-neutral-400'
      }
    };
    return configs[type];
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
