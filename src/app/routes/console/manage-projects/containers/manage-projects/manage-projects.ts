import {Component, computed, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {Pagination} from '../../../../../shared/components/pagination/pagination';
import {ProjectCreate} from '../project-create/project-create';
import {ProjectItem} from '../../components/project-item/project-item';
import {ToastService} from '../../../../../shared/services/toast.service';
import {ConfirmationModal} from '../../../../../shared/components/confirmation-modal/confirmation-modal';
import {ProjectLightDto} from '../../../../projects/state/project/project.model';

@Component({
  selector: 'app-manage-projects',
  imports: [
    MatButtonModule,
    MatIconModule,
    SidePanel,
    Pagination,
    ProjectCreate,
    ProjectItem,
    ConfirmationModal,
  ],
  templateUrl: './manage-projects.html',
  styleUrl: './manage-projects.scss'
})
export class ManageProjects {
  private static readonly PAGE_SIZE = 6;

  readonly facade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly panelOpen = signal(false);
  readonly confirmModalOpen = signal(false);
  readonly projectToDelete = signal<ProjectLightDto | null>(null);
  private readonly projectJustCreated = signal(false);

  readonly deletionMessage = computed(() => {
    const project = this.projectToDelete();
    return project
      ? `Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ? Cette action est irréversible.`
      : '';
  });

  constructor() {
    this.facade.loadProjects({page: 1, limit: ManageProjects.PAGE_SIZE});
  }

  openPanel(): void {
    this.panelOpen.set(true);
    this.projectJustCreated.set(false);
  }

  closePanel(): void {
    this.panelOpen.set(false);

    if (this.projectJustCreated()) {
      this.toastService.success('Projet créé avec succès');
      this.projectJustCreated.set(false);
    }
  }

  onProjectCreated(): void {
    this.projectJustCreated.set(true);
    this.closePanel();
  }

  onEdit(project: ProjectLightDto): void {
    console.log('Edit project:', project);
  }

  onRemove(project: ProjectLightDto): void {
    this.projectToDelete.set(project);
    this.confirmModalOpen.set(true);
  }

  confirmDelete(): void {
    const project = this.projectToDelete();
    if (!project) return;

    this.resetModal();

    this.facade.deleteProject(project.id).subscribe({
      next: () => this.toastService.success('Projet supprimé avec succès'),
      error: () => this.toastService.error('Erreur lors de la suppression du projet')
    });
  }

  cancelDelete(): void {
    this.resetModal();
  }

  private resetModal(): void {
    this.confirmModalOpen.set(false);
    this.projectToDelete.set(null);
  }
}
