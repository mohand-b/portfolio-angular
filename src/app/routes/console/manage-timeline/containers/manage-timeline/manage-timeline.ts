import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../../career/state/timeline/timeline.model';
import {TimelineStore} from '../../../../career/state/timeline/timeline.store';
import {EducationDto} from '../../../../career/state/education/education.model';
import {JobDto} from '../../../../career/state/job/job.model';
import {MilestoneDto} from '../../../../career/state/milestone/milestone.model';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {EducationForm} from '../../components/education-form/education-form';
import {JobForm} from '../../components/job-form/job-form';
import {MilestoneForm} from '../../components/milestone-form/milestone-form';
import {MilestoneTimelineItemCreate} from '../../components/milestone-timeline-item-create/milestone-timeline-item-create';
import {ProjectTimelineLink} from '../../components/project-timeline-link/project-timeline-link';
import {TimelineItem} from '../../../../career/components/timeline/timeline-item/timeline-item';
import {ConfirmationModal} from '../../../../../shared/components/confirmation-modal/confirmation-modal';
import {ConsoleFacade} from '../../../console.facade';
import {ToastService} from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-manage-timeline',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    SidePanel,
    EducationForm,
    JobForm,
    MilestoneForm,
    MilestoneTimelineItemCreate,
    ProjectTimelineLink,
    TimelineItem,
    ConfirmationModal
  ],
  templateUrl: './manage-timeline.html',
  styleUrl: './manage-timeline.scss'
})
export class ManageTimeline {
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);
  protected readonly timelineStore = inject(TimelineStore);
  protected readonly typeControl = new FormControl<TimelineItemType | null>(null, {
    nonNullable: false,
    validators: [Validators.required]
  });
  protected readonly types = Object.values(TimelineItemType);
  protected readonly typeMeta = TIMELINE_ITEM_TYPE_META;
  protected readonly selectedType = toSignal(this.typeControl.valueChanges, {initialValue: this.typeControl.value});
  protected readonly TimelineItemType = TimelineItemType;
  protected readonly panelOpen = signal(false);
  protected readonly editEducationPanelOpen = signal(false);
  protected readonly editJobPanelOpen = signal(false);
  protected readonly editMilestonePanelOpen = signal(false);
  protected readonly deleteModalOpen = signal(false);
  protected readonly detachModalOpen = signal(false);
  protected readonly itemToDelete = signal<{id: string; type: TimelineItemType} | null>(null);
  protected readonly projectToDetach = signal<string | null>(null);
  protected readonly educationToEdit = signal<EducationDto | null>(null);
  protected readonly jobToEdit = signal<JobDto | null>(null);
  protected readonly milestoneToEdit = signal<MilestoneDto | null>(null);

  openPanel(): void {
    this.panelOpen.set(true);
    this.typeControl.reset();
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }

  onEditEducationCloseRequested(): void {
    this.editEducationPanelOpen.set(false);
    this.educationToEdit.set(null);
  }

  onEditJobCloseRequested(): void {
    this.editJobPanelOpen.set(false);
    this.jobToEdit.set(null);
  }

  onEditMilestoneCloseRequested(): void {
    this.editMilestonePanelOpen.set(false);
    this.milestoneToEdit.set(null);
  }

  onDeleteRequested(itemId: string): void {
    const item = this.timelineStore.items().find(i => i.id === itemId);
    if (!item) return;
    this.itemToDelete.set({id: itemId, type: item.type});
    this.deleteModalOpen.set(true);
  }

  onEditRequested(itemId: string): void {
    const item = this.timelineStore.items().find(i => i.id === itemId);
    if (!item) return;

    if (item.type === TimelineItemType.Education) {
      this.educationToEdit.set(item as unknown as EducationDto);
      this.editEducationPanelOpen.set(true);
    } else if (item.type === TimelineItemType.Job) {
      this.jobToEdit.set(item as unknown as JobDto);
      this.editJobPanelOpen.set(true);
    } else if (item.type === TimelineItemType.Milestone) {
      this.milestoneToEdit.set(item as unknown as MilestoneDto);
      this.editMilestonePanelOpen.set(true);
    }
  }

  onDetachRequested(itemId: string): void {
    this.projectToDetach.set(itemId);
    this.detachModalOpen.set(true);
  }

  onDetachConfirmed(): void {
    const projectId = this.projectToDetach();
    if (!projectId) return;

    this.consoleFacade.detachProjectFromTimeline(projectId).subscribe({
      next: () => {
        this.toastService.success('Projet détaché de la timeline avec succès');
        this.closeDetachModal();
      },
      error: () => {
        this.toastService.error('Erreur lors du détachement du projet');
        this.closeDetachModal();
      }
    });
  }

  onDetachCancelled(): void {
    this.closeDetachModal();
  }

  onDeleteConfirmed(): void {
    const itemToDelete = this.itemToDelete();
    if (!itemToDelete) return;

    const {id, type} = itemToDelete;
    let operation$;
    let successMessage: string;
    let errorMessage: string;

    switch (type) {
      case TimelineItemType.Education:
        operation$ = this.consoleFacade.deleteEducation(id);
        successMessage = 'Formation supprimée avec succès';
        errorMessage = 'Erreur lors de la suppression de la formation';
        break;
      case TimelineItemType.Job:
        operation$ = this.consoleFacade.deleteJob(id);
        successMessage = 'Expérience supprimée avec succès';
        errorMessage = 'Erreur lors de la suppression de l\'expérience';
        break;
      case TimelineItemType.Milestone:
        operation$ = this.consoleFacade.deleteMilestone(id);
        successMessage = 'Moment supprimé avec succès';
        errorMessage = 'Erreur lors de la suppression du moment';
        break;
      default:
        return;
    }

    operation$.subscribe({
      next: () => {
        this.toastService.success(successMessage);
        this.closeDeleteModal();
      },
      error: () => {
        this.toastService.error(errorMessage);
        this.closeDeleteModal();
      }
    });
  }

  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
    this.itemToDelete.set(null);
  }

  private closeDetachModal(): void {
    this.detachModalOpen.set(false);
    this.projectToDetach.set(null);
  }
}