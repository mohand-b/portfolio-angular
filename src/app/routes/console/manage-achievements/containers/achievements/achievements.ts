import {Component, inject, Signal} from '@angular/core';
import {ConsoleFacade} from '../../../console.facade';
import {toSignal} from '@angular/core/rxjs-interop';
import {AchievementLight, AchievementUnlockLog} from '../../../../../core/state/achievement/achievement.model';
import {DatePipe} from '@angular/common';
import {AchievementCreate} from '../achievement-create/achievement-create';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-achievements',
  imports: [AchievementCreate, DatePipe, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {

  readonly displayedColumnsAchievements: string[] = ['code', 'label', 'description', 'actions'];
  private consoleFacade = inject(ConsoleFacade);
  achievementLogs: Signal<AchievementUnlockLog[]> = toSignal(this.consoleFacade.getAchievementLogs(), {
    initialValue: []
  });
  achievements: Signal<AchievementLight[]> = this.consoleFacade.achievements;

  deleteAchievement(code: string): void {
    this.consoleFacade.deleteAchievementByCode(code).subscribe();
  }


}
