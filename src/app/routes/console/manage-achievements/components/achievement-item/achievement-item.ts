import {Component, input, output} from '@angular/core';
import {Achievement} from '../../../../../core/state/achievement/achievement.model';
import {UpperCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AchievementIconComponent} from '../../../../../shared/components/achievement-icon/achievement-icon';

@Component({
  selector: 'app-achievement-item',
  imports: [
    UpperCasePipe,
    MatIconModule,
    MatTooltipModule,
    AchievementIconComponent,
  ],
  templateUrl: './achievement-item.html'
})
export class AchievementItem {
  achievement = input.required<Achievement>();
  edit = output<Achievement>();
  remove = output<Achievement>();
}
