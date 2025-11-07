import {Component, inject} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {MatIconModule} from '@angular/material/icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast-container',
  imports: [MatIconModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  getToastConfig(type: ToastType) {
    const configs: Record<ToastType, { bgClass: string; icon: string }> = {
      success: {bgClass: 'bg-green-100 text-green-800 border border-green-200', icon: 'check_circle'},
      error: {bgClass: 'bg-red-100 text-red-600 border border-red-200', icon: 'error'},
      warning: {bgClass: 'bg-orange-100 text-orange-600 border border-orange-200', icon: 'warning'},
      info: {bgClass: 'bg-blue-100 text-blue-600 border border-blue-200', icon: 'info'}
    };
    return configs[type];
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
