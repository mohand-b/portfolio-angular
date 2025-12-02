import {Component, computed, inject, signal, Signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Achievement, AchievementStats} from '../../../../../core/state/achievement/achievement.model';
import {ConsoleFacade} from '../../../console.facade';
import {AchievementForm} from '../../components/achievement-form/achievement-form';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {AchievementItem} from '../../components/achievement-item/achievement-item';
import {KpiCard} from '../../../../../shared/components/kpi-card/kpi-card';
import {Pagination} from '../../../../../shared/components/pagination/pagination';
import {ConfirmationModal} from '../../../../../shared/components/confirmation-modal/confirmation-modal';
import {ToastService} from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-manage-achievements',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    AchievementForm,
    SidePanel,
    AchievementItem,
    KpiCard,
    Pagination,
    ConfirmationModal
  ],
  templateUrl: './manage-achievements.html'
})
export class ManageAchievements {
  readonly facade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly achievements: Signal<Achievement[]> = this.facade.achievements;
  readonly totalActiveAchievements: Signal<number> = this.facade.totalActiveAchievements;
  readonly achievementStats: Signal<AchievementStats> = this.facade.achievementStats;

  readonly panelOpen = signal(false);
  readonly selectedAchievement = signal<Achievement | null>(null);
  readonly confirmModalOpen = signal(false);
  readonly achievementToDelete = signal<Achievement | null>(null);

  readonly deletionMessage = computed(() => {
    const achievement = this.achievementToDelete();
    return achievement ? `Êtes-vous sûr de vouloir supprimer le succès "${achievement.label}" ?` : '';
  });

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
    this.achievementToDelete.set(achievement);
    this.confirmModalOpen.set(true);
  }

  confirmDelete(): void {
    const achievement = this.achievementToDelete();
    if (!achievement) return;
    this.resetModal();
    this.facade.deleteAchievementByCode(achievement.code).subscribe({
      next: () => this.toastService.success('Succès supprimé avec succès'),
      error: () => this.toastService.error('Erreur lors de la suppression du succès')
    });
  }

  cancelDelete(): void {
    this.resetModal();
  }

  private resetModal(): void {
    this.confirmModalOpen.set(false);
    this.achievementToDelete.set(null);
  }
}
