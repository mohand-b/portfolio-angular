import {Component, computed, inject, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {httpResource} from '@angular/common/http';
import {environment} from '../../../../../../../environments/environments';
import {ConsoleFacade} from '../../../console.facade';
import {ProjectMinimalResponseDto} from '../../../../projects/state/project/project.model';
import {ToastService} from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-project-timeline-link',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './project-timeline-link.html'
})
export class ProjectTimelineLink {
  private readonly fb = inject(FormBuilder);
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly created = output<void>();

  private readonly projectsResource = httpResource<ProjectMinimalResponseDto[]>(() => ({
    url: `${environment.baseUrl}/projects/unlinked`,
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
  }));

  readonly unlinkedProjects = computed(() => this.projectsResource.value() ?? []);
  readonly isLoading = computed(() => this.projectsResource.isLoading());

  readonly projectForm = this.fb.group({
    projectId: ['', Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null],
  });

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const {projectId, startDate, endDate} = this.projectForm.getRawValue();

    this.isSubmitting.set(true);
    this.consoleFacade.linkProjectToTimeline(projectId!, {
      startDate: startDate!,
      endDate: endDate || undefined,
    }).subscribe({
      next: () => {
        this.toastService.success('Projet ajouté au parcours avec succès');
        this.projectForm.reset();
        this.isSubmitting.set(false);
        this.projectsResource.reload();
        this.created.emit();
      },
      error: () => {
        this.toastService.error('Erreur lors de l\'ajout du projet au parcours');
        this.projectForm.markAllAsTouched();
        this.isSubmitting.set(false);
      },
    });
  }
}
