import {Component, inject, Signal} from '@angular/core';
import {ConsoleFacade} from '../../console.facade';
import {toSignal} from '@angular/core/rxjs-interop';
import {AchievementLight, AchievementUnlockLog} from '../../../../core/state/achievement/achievement.model';
import {DatePipe} from '@angular/common';
import {AchievementCreate} from '../achievement-create/achievement-create';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-achievements',
  imports: [AchievementCreate, DatePipe, MatTableModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {

  readonly displayedColumnsAchievements: string[] = ['code', 'label', 'description'];
  private consoleFacade = inject(ConsoleFacade);
  achievementLogs: Signal<AchievementUnlockLog[]> = toSignal(this.consoleFacade.getAchievementLogs(), {
    initialValue: []
  });
  achievements: Signal<AchievementLight[]> = this.consoleFacade.achievements;


}
