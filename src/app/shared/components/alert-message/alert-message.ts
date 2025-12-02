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
    bgColor: 'alert-error-bg',
    borderColor: 'alert-error-border',
    textColor: 'alert-error-text',
    icon: 'error',
    iconColor: 'alert-error-icon'
  },
  warning: {
    bgColor: 'alert-warning-bg',
    borderColor: 'alert-warning-border',
    textColor: 'alert-warning-text',
    icon: 'warning',
    iconColor: 'alert-warning-icon'
  },
  info: {
    bgColor: 'alert-info-bg',
    borderColor: 'alert-info-border',
    textColor: 'alert-info-text',
    icon: 'info',
    iconColor: 'alert-info-icon'
  }
};

@Component({
  selector: 'app-alert-message',
  imports: [MatIconModule],
  templateUrl: './alert-message.html'
})
export class AlertMessage {
  readonly type = input.required<AlertType>();
  readonly message = input.required<string>();

  readonly config = computed(() => ALERT_CONFIGS[this.type()]);
}
