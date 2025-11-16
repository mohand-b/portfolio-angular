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
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {EducationForm} from '../../components/education-form/education-form';
import {JobCreate} from '../../components/job-create/job-create';
import {OtherTimelineItemCreate} from '../../components/other-timeline-item-create/other-timeline-item-create';
import {ProjectTimelineLink} from '../../components/project-timeline-link/project-timeline-link';
import {TimelineItem} from '../../components/timeline-item/timeline-item';
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
    JobCreate,
    OtherTimelineItemCreate,
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
  protected readonly editPanelOpen = signal(false);
  protected readonly deleteModalOpen = signal(false);
  protected readonly educationToDelete = signal<string | null>(null);
  protected readonly educationToEdit = signal<EducationDto | null>(null);

  openPanel(): void {
    this.panelOpen.set(true);
    this.typeControl.reset();
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }

  onEditCloseRequested(): void {
    this.editPanelOpen.set(false);
    this.educationToEdit.set(null);
  }

  onDeleteEducationRequested(educationId: string): void {
    this.educationToDelete.set(educationId);
    this.deleteModalOpen.set(true);
  }

  onEditEducationRequested(educationId: string): void {
    const education = this.timelineStore.items().find(item => item.id === educationId);
    if (education && education.type === TimelineItemType.Education) {
      this.educationToEdit.set(education as unknown as EducationDto);
      this.editPanelOpen.set(true);
    }
  }

  onDeleteConfirmed(): void {
    const id = this.educationToDelete();
    if (!id) return;

    this.consoleFacade.deleteEducation(id).subscribe({
      next: () => {
        this.toastService.success('Formation supprimée avec succès');
        this.closeDeleteModal();
      },
      error: () => {
        this.toastService.error('Erreur lors de la suppression de la formation');
        this.closeDeleteModal();
      }
    });
  }

  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
    this.educationToDelete.set(null);
  }
}