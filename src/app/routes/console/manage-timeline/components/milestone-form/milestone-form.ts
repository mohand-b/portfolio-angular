import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {ConsoleFacade} from '../../../console.facade';
import {ToastService} from '../../../../../shared/services/toast.service';
import {MilestoneDto} from '../../../../career/state/milestone/milestone.model';

@Component({
  selector: 'app-milestone-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './milestone-form.html',
  styleUrl: './milestone-form.scss',
})
export class MilestoneForm {
  private readonly fb = inject(FormBuilder);
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly milestone = input<MilestoneDto | null>(null);
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly imagePreview = signal<string | null>(null);
  readonly isEditing = computed(() => !!this.milestone());

  readonly milestoneForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null],
    description: [''],
    image: [null as File | null],
  });

  constructor() {
    effect(() => {
      const milestone = this.milestone();
      if (!milestone) return;

      this.milestoneForm.patchValue({
        title: milestone.title,
        startDate: milestone.startDate ? new Date(milestone.startDate) : null,
        endDate: milestone.endDate ? new Date(milestone.endDate) : null,
        description: milestone.description || '',
        image: null,
      });

      this.imagePreview.set(milestone.image || null);
    });
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.milestoneForm.patchValue({image});

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(image);
  }

  onSubmit(): void {
    if (this.milestoneForm.invalid) {
      this.milestoneForm.markAllAsTouched();
      return;
    }

    const formValue = this.milestoneForm.getRawValue();
    const formData = toFormData({
      title: formValue.title!.trim(),
      startDate: formValue.startDate?.toISOString(),
      endDate: formValue.endDate?.toISOString(),
      description: formValue.description?.trim() || undefined,
      image: formValue.image as File | null,
    });

    this.isSubmitting.set(true);

    const operation$ = this.isEditing()
      ? this.consoleFacade.updateMilestone(this.milestone()!.id, formData)
      : this.consoleFacade.addMilestone(formData);

    operation$.subscribe({
      next: () => {
        const message = this.isEditing() ? 'Moment modifié avec succès' : 'Moment créé avec succès';
        this.toastService.success(message);
        if (!this.isEditing()) {
          this.resetForm();
        }
        this.isSubmitting.set(false);
        this.saved.emit();
      },
      error: () => {
        const message = this.isEditing()
          ? 'Erreur lors de la modification du moment'
          : 'Erreur lors de la création du moment';
        this.toastService.error(message);
        this.milestoneForm.markAllAsTouched();
        this.isSubmitting.set(false);
      },
    });
  }

  private resetForm(): void {
    this.milestoneForm.reset();
    this.imagePreview.set(null);
    this.isSubmitting.set(false);
  }
}
