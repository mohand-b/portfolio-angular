import {Component, inject} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToastService} from '../../services/toast.service';
import {MatIconModule} from '@angular/material/icon';
import {hexWithAlpha} from '../../utils/color.utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement';

@Component({
  selector: 'app-toast-container',
  imports: [MatIconModule, NgClass],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;
  readonly hexWithAlpha = hexWithAlpha;

  getToastConfig(type: ToastType) {
    const configs: Record<ToastType, { bgClass: string; icon: string; iconClass: string }> = {
      success: {bgClass: 'bg-green-100 text-green-800 border border-green-200', icon: 'check_circle', iconClass: 'text-green-800'},
      error: {bgClass: 'bg-red-100 text-red-600 border border-red-200', icon: 'error', iconClass: 'text-red-600'},
      warning: {bgClass: 'bg-orange-100 text-orange-600 border border-orange-200', icon: 'warning', iconClass: 'text-orange-600'},
      info: {bgClass: 'bg-blue-100 text-blue-600 border border-blue-200', icon: 'info', iconClass: 'text-blue-600'},
      achievement: {bgClass: 'bg-neutral-100 text-neutral-800 border border-neutral-200', icon: 'emoji_events', iconClass: 'text-amber-500'}
    };
    return configs[type];
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
