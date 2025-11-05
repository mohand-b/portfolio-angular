import {Component, computed, input, output} from '@angular/core';
import {Achievement} from '../../../../../core/state/achievement/achievement.model';
import {UpperCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {hexWithAlpha} from '../../../../../shared/utils/color.utils';

@Component({
  selector: 'app-achievement-item',
  imports: [
    UpperCasePipe,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './achievement-item.html'
})
export class AchievementItem {
  achievement = input.required<Achievement>();
  edit = output<Achievement>();
  remove = output<Achievement>();

  iconBgColor = computed(() => {
    const color = this.achievement().color || '#6366f1';
    return hexWithAlpha(color, 0.12);
  });
}
