import {Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {hexWithAlpha} from '../../utils/color.utils';

@Component({
  selector: 'app-kpi-card',
  imports: [MatIconModule],
  templateUrl: './kpi-card.html'
})
export class KpiCard {
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>('star');
  color = input<string>('#6366f1');
  isPercent = input<boolean>(false);

  protected readonly hexWithAlpha = hexWithAlpha;

  protected readonly formattedValue = computed(() => {
    const val = this.value();

    if (typeof val === 'number') {
      return Math.round(val);
    }
    return val || 0;
  });
}
