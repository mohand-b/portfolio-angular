import {Component, inject, signal, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {AchievementLight, AchievementUnlockLog} from '../../../../../core/state/achievement/achievement.model';
import {ConsoleFacade} from '../../../console.facade';
import {AchievementCreate} from '../../components/achievement-create/achievement-create';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    AchievementCreate,
    SidePanel
  ],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {
  private readonly consoleFacade = inject(ConsoleFacade);

  readonly displayedColumnsAchievements: string[] = ['code', 'label', 'description', 'actions'];

  readonly achievements: Signal<AchievementLight[]> = this.consoleFacade.achievements;
  readonly achievementLogs: Signal<AchievementUnlockLog[]> = toSignal(
    this.consoleFacade.getAchievementLogs(),
    {initialValue: []}
  );

  readonly panelOpen = signal(false);

  openPanel(): void {
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }

  deleteAchievement(code: string): void {
    this.consoleFacade.deleteAchievementByCode(code).subscribe();
  }
}
