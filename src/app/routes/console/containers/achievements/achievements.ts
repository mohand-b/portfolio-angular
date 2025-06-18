import {Component, inject, Signal} from '@angular/core';
import {ConsoleFacade} from '../../console.facade';
import {toSignal} from '@angular/core/rxjs-interop';
import {AchievementUnlockLog} from '../../../../core/state/achievement/achievement.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-achievements',
  imports: [DatePipe],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {

  private consoleFacade = inject(ConsoleFacade);

  achievementLogs: Signal<AchievementUnlockLog[]> = toSignal(this.consoleFacade.getAchievementLogs(), {
    initialValue: []
  });

}
