import {Injectable, signal} from '@angular/core';
import {ToastType} from '../components/toast-container/toast-container';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  removing?: boolean;
}

@Injectable({providedIn: 'root'})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration: number = 4000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type
    };

    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: number): void {
    this.toasts.update(toasts =>
      toasts.map(t => t.id === id ? {...t, removing: true} : t)
    );

    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, 300);
  }
}
