import {Component, computed, inject, signal} from '@angular/core';
import {PaginatedVisitorsResponse, VisitorDto, VisitorStats} from '../../../../../core/state/visitor/visitor.model';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SvgSafePipe} from '../../../../../shared/pipes/svg-safe.pipe';
import {httpResource} from '@angular/common/http';
import {environment} from '../../../../../../../environments/environments';
import {KpiCard} from '../../../../../shared/components/kpi-card/kpi-card';
import {VisitorService} from '../../../../../core/state/visitor/visitor.service';
import {ConfirmationModal} from '../../../../../shared/components/confirmation-modal/confirmation-modal';
import {ToastService} from '../../../../../shared/services/toast.service';

registerLocaleData(localeFr);

interface TableColumn {
  key: string;
  label: string;
  width: string;
}

interface ActionButton {
  icon: string;
  tooltip: string;
  handler: (visitor: VisitorDto) => void;
  hoverClass?: string;
}

const TABLE_COLUMNS: TableColumn[] = [
  {key: 'visitor', label: 'Visiteur', width: '16rem'},
  {key: 'createdAt', label: 'Première visite', width: '10rem'},
  {key: 'lastVisitAt', label: 'Dernière visite', width: '10rem'},
  {key: 'achievements', label: 'Succès', width: '12.5rem'},
  {key: 'status', label: 'Statut', width: '8.75rem'},
  {key: 'actions', label: 'Actions', width: '7.5rem'}
];

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

@Component({
  selector: 'app-manage-visitors',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SvgSafePipe,
    KpiCard,
    ConfirmationModal
  ],
  templateUrl: './manage-visitors.html',
  styleUrl: './manage-visitors.scss'
})
export class ManageVisitors {
  private readonly visitorService = inject(VisitorService);
  private readonly toastService = inject(ToastService);

  readonly columns = TABLE_COLUMNS;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  readonly page = signal(1);
  readonly limit = signal(5);
  readonly confirmModalOpen = signal(false);
  readonly visitorToDelete = signal<VisitorDto | null>(null);
  readonly deletionMessage = computed(() => {
    const visitor = this.visitorToDelete();
    return visitor
      ? `Êtes-vous sûr de vouloir supprimer ${visitor.firstName} ${visitor.lastName} ? Cette action est irréversible.`
      : '';
  });

  private readonly visitorsResource = httpResource<PaginatedVisitorsResponse>(() => ({
    url: `${environment.baseUrl}/visitor/all`,
    method: 'GET',
    params: {
      page: this.page().toString(),
      limit: this.limit().toString()
    },
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
  }));

  private readonly statsResource = httpResource<VisitorStats>(() => ({
    url: `${environment.baseUrl}/visitor/stats`,
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
  }));

  readonly loading = computed(() => this.visitorsResource.isLoading());
  readonly data = computed(() => this.visitorsResource.value()?.data ?? []);
  readonly totalPages = computed(() => this.visitorsResource.value()?.totalPages ?? 0);
  readonly stats = computed(() => this.statsResource.value());

  readonly skeletonRows = computed(() => Array.from({length: this.limit()}, (_, i) => i));

  readonly actionButtons: ActionButton[] = [
    {icon: 'visibility', tooltip: 'Voir les détails', handler: (visitor) => this.onView(visitor)},
    {icon: 'mail', tooltip: 'Envoyer un email', handler: (visitor) => this.onMail(visitor)},
    {icon: 'delete', tooltip: 'Supprimer', handler: (visitor) => this.onRemove(visitor), hoverClass: 'hover:bg-red-50'}
  ];

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.page.set(page);
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
    }
  }

  getInitials(visitor: VisitorDto): string {
    const first = visitor.firstName.charAt(0).toUpperCase();
    const last = visitor.lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }

  onView(visitor: VisitorDto): void {
    console.log('View visitor:', visitor);
  }

  onMail(visitor: VisitorDto): void {
    console.log('Mail visitor:', visitor);
  }

  onRemove(visitor: VisitorDto): void {
    this.visitorToDelete.set(visitor);
    this.confirmModalOpen.set(true);
  }

  onConfirmDelete(): void {
    const visitor = this.visitorToDelete();
    if (!visitor) return;

    this.closeModal();

    this.visitorService.delete(visitor.id).subscribe({
      next: () => {
        this.visitorsResource.reload();
        this.statsResource.reload();
        this.toastService.success('Visiteur supprimé avec succès');
      },
      error: () => {
        this.toastService.error('Erreur lors de la suppression du visiteur');
      }
    });
  }

  onCancelDelete(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.confirmModalOpen.set(false);
    this.visitorToDelete.set(null);
  }

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = parseInt(select.value, 10);
    this.limit.set(newLimit);
    this.page.set(1);
  }

  getProgressBarColor(percentage: number): string {
    const thresholds = [
      {max: 20, class: 'bg-slate-500'},
      {max: 39, class: 'bg-gradient-to-r from-yellow-400 to-orange-400'},
      {max: 59, class: 'bg-gradient-to-r from-cyan-500 to-sky-400'},
      {max: 79, class: 'bg-gradient-to-r from-blue-500 to-indigo-500'},
      {max: 99, class: 'bg-gradient-to-r from-fuchsia-500 to-pink-500'},
      {max: 100, class: 'bg-green-500'}
    ];
    return thresholds.find(t => percentage <= t.max)?.class || 'bg-green-500';
  }

  getProgressIcon(percentage: number): string {
    const levels = [
      {max: 20, icon: '🌱'},
      {max: 39, icon: '⭐'},
      {max: 59, icon: '🔥'},
      {max: 79, icon: '🏅'},
      {max: 99, icon: '🏆'},
      {max: 100, icon: '👑'}
    ];
    return levels.find(l => percentage <= l.max)?.icon || '👑';
  }

  getProgressLabel(percentage: number): string {
    const levels = [
      {max: 20, label: 'Nouveau'},
      {max: 39, label: 'Curieux'},
      {max: 59, label: 'Engagé'},
      {max: 79, label: 'Explorateur'},
      {max: 99, label: 'Investi'},
      {max: 100, label: 'Complet'}
    ];
    return levels.find(l => percentage <= l.max)?.label || 'Complet';
  }

  getStatusConfig(isVerified: boolean) {
    return {
      bgClass: isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      dotClass: isVerified ? 'bg-green-500' : 'bg-red-500',
      label: isVerified ? 'Vérifié' : 'Non vérifié'
    };
  }
}
