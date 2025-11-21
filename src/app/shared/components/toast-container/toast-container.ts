import {Component, inject} from '@angular/core';
import {NgClass} from '@angular/common';
import {ToastService} from '../../services/toast.service';
import {MatIconModule} from '@angular/material/icon';

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

  lightenColor(hex: string, amount: number = 0.85): string {
    const sanitized = hex.replace('#', '');
    const r = parseInt(sanitized.substring(0, 2), 16);
    const g = parseInt(sanitized.substring(2, 4), 16);
    const b = parseInt(sanitized.substring(4, 6), 16);

    const lightenedR = Math.round(r + (255 - r) * amount);
    const lightenedG = Math.round(g + (255 - g) * amount);
    const lightenedB = Math.round(b + (255 - b) * amount);

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`;
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
