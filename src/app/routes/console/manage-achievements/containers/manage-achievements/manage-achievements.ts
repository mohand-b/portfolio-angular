import {Component, inject, signal, Signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Achievement, AchievementStats} from '../../../../../core/state/achievement/achievement.model';
import {ConsoleFacade} from '../../../console.facade';
import {AchievementForm} from '../../components/achievement-form/achievement-form';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {AchievementItem} from '../../components/achievement-item/achievement-item';
import {KpiCard} from '../../../../../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-manage-achievements',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    AchievementForm,
    SidePanel,
    AchievementItem,
    KpiCard
  ],
  templateUrl: './manage-achievements.html',
  styleUrl: './manage-achievements.scss'
})
export class ManageAchievements {
  private readonly consoleFacade = inject(ConsoleFacade);

  readonly achievements: Signal<Achievement[]> = this.consoleFacade.achievements;
  readonly totalAchievements: Signal<number> = this.consoleFacade.totalAchievements;
  readonly totalActiveAchievements: Signal<number> = this.consoleFacade.totalActiveAchievements;
  readonly achievementStats: Signal<AchievementStats | null> = this.consoleFacade.achievementStats;

  readonly panelOpen = signal(false);
  readonly selectedAchievement = signal<Achievement | null>(null);

  openPanel(): void {
    this.selectedAchievement.set(null);
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
    this.selectedAchievement.set(null);
  }

  onEdit(achievement: Achievement): void {
    this.selectedAchievement.set(achievement);
    this.panelOpen.set(true);
  }

  onRemove(achievement: Achievement): void {
    this.consoleFacade.deleteAchievementByCode(achievement.code).subscribe();
  }
}
