import {Component, inject, signal, Signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Achievement, AchievementStats} from '../../../../../core/state/achievement/achievement.model';
import {ConsoleFacade} from '../../../console.facade';
import {AchievementCreate} from '../../components/achievement-create/achievement-create';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {AchievementItem} from '../../components/achievement-item/achievement-item';
import {KpiCard} from '../../../../../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    AchievementCreate,
    SidePanel,
    AchievementItem,
    KpiCard
  ],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements {
  private readonly consoleFacade = inject(ConsoleFacade);

  readonly achievements: Signal<Achievement[]> = this.consoleFacade.achievements;
  readonly totalAchievements: Signal<number> = this.consoleFacade.totalAchievements;
  readonly totalActiveAchievements: Signal<number> = this.consoleFacade.totalActiveAchievements;
  readonly achievementStats: Signal<AchievementStats | null> = this.consoleFacade.achievementStats;

  readonly panelOpen = signal(false);

  openPanel(): void {
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }

  onEdit(achievement: Achievement): void {
    console.log('Edit achievement:', achievement);
  }

  onRemove(achievement: Achievement): void {
    this.consoleFacade.deleteAchievementByCode(achievement.code).subscribe();
  }
}
