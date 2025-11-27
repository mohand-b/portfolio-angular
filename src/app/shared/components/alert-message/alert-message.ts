import {Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

export type AlertType = 'error' | 'warning' | 'info';

interface AlertConfig {
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  iconColor: string;
}

const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: 'error',
    iconColor: 'text-red-600'
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    icon: 'warning',
    iconColor: 'text-amber-600'
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: 'info',
    iconColor: 'text-blue-600'
  }
};

@Component({
  selector: 'app-alert-message',
  imports: [MatIconModule],
  templateUrl: './alert-message.html',
  styleUrl: './alert-message.scss'
})
export class AlertMessage {
  readonly type = input.required<AlertType>();
  readonly message = input.required<string>();

  readonly config = computed(() => ALERT_CONFIGS[this.type()]);
}
