import {Component, computed, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConfirmationModal} from '../../../../../shared/components/confirmation-modal/confirmation-modal';
import {Pagination} from '../../../../../shared/components/pagination/pagination';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {ToastService} from '../../../../../shared/services/toast.service';
import {ProjectDto, ProjectLightDto} from '../../../../projects/state/project/project.model';
import {ProjectService} from '../../../../projects/state/project/project.service';
import {ConsoleFacade} from '../../../console.facade';
import {ProjectItem} from '../../components/project-item/project-item';
import {ProjectForm} from '../project-form/project-form';

@Component({
  selector: 'app-manage-projects',
  imports: [
    MatButtonModule,
    MatIconModule,
    SidePanel,
    Pagination,
    ProjectForm,
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
  private readonly projectService = inject(ProjectService);

  readonly panelOpen = signal(false);
  readonly selectedProject = signal<ProjectDto | null>(null);
  readonly confirmModalOpen = signal(false);
  readonly projectToDelete = signal<ProjectLightDto | null>(null);

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
    this.selectedProject.set(null);
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
    this.selectedProject.set(null);
  }

  onEdit(project: ProjectLightDto): void {
    this.projectService.getProjectById(project.id).subscribe({
      next: (fullProject) => {
        this.selectedProject.set(fullProject);
        this.panelOpen.set(true);
      },
      error: () => this.toastService.error('Erreur lors du chargement du projet')
    });
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
