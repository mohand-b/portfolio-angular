import {Injectable, signal} from '@angular/core';
import {ToastType} from '../components/toast-container/toast-container';
import {AchievementDto} from '../../core/state/achievement/achievement.model';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  removing?: boolean;
  achievement?: AchievementDto;
  duration?: number;
}

@Injectable({providedIn: 'root'})
export class ToastService {
  private nextId = 0;
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private readonly QUEUE_DELAY = 2000;

  readonly toasts = signal<Toast[]>([]);

  private processQueue(): void {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    const showToast = this.queue.shift();
    if (showToast) {
      showToast();
      setTimeout(() => {
        this.isProcessing = false;
        this.processQueue();
      }, this.QUEUE_DELAY);
    }
  }

  private addToQueue(toast: Toast, duration: number): void {
    this.queue.push(() => {
      this.toasts.update(toasts => [...toasts, toast]);
      if (duration > 0) {
        setTimeout(() => this.remove(toast.id), duration);
      }
    });
    this.processQueue();
  }

  show(message: string, type: Toast['type'] = 'info', duration: number = 5000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration
    };

    this.addToQueue(toast, duration);
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

  achievement(achievementDto: AchievementDto, duration: number = 6000): void {
    const toast: Toast = {
      id: this.nextId++,
      message: '',
      type: 'achievement',
      achievement: achievementDto,
      duration
    };

    this.addToQueue(toast, duration);
  }

  remove(id: number): void {
    this.toasts.update(toasts => toasts.map(t => t.id === id ? {...t, removing: true} : t));
    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, 300);
  }
}
