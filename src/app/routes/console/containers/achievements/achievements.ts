import {Component, inject, Signal} from '@angular/core';
import {ConsoleFacade} from '../../console.facade';
import {toSignal} from '@angular/core/rxjs-interop';
import {Achievement, AchievementUnlockLog} from '../../../../core/state/achievement/achievement.model';
import {DatePipe} from '@angular/common';
import {AchievementCreate} from '../achievement-create/achievement-create';

@Component({
  selector: 'app-achievements',
  imports: [AchievementCreate, DatePipe],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {

  private consoleFacade = inject(ConsoleFacade);

  achievementLogs: Signal<AchievementUnlockLog[]> = toSignal(this.consoleFacade.getAchievementLogs(), {
    initialValue: []
  });
  achievements: Signal<Achievement[]> = this.consoleFacade.achievements;

}
