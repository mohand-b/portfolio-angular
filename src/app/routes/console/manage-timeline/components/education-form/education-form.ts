import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {ConsoleFacade} from '../../../console.facade';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {StepConfig, Stepper} from '../../../../../shared/components/stepper/stepper';
import {ToastService} from '../../../../../shared/services/toast.service';
import {
  CERTIFICATION_TYPE_META,
  CertificationInputDto,
  CertificationType,
  EducationDto
} from '../../../../career/state/education/education.model';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../../career/state/timeline/timeline.model';

const DEFAULT_CERTIFICATION = {
  title: '',
  certificationType: CertificationType.Academic
};
const STEPS: StepConfig[] = [
  {icon: 'info', text: 'Informations'},
  {icon: 'business', text: 'Établissement'},
  {icon: 'workspace_premium', text: 'Diplômes'}
];

@Component({
  selector: 'app-education-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    Stepper
  ],
  templateUrl: './education-form.html',
  styleUrl: './education-form.scss'
})
export class EducationForm {
  private readonly fb = inject(FormBuilder);
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly education = input<EducationDto | null>(null);
  readonly saved = output<void>();

  readonly step = signal(0);
  readonly isSubmitting = signal(false);
  readonly imagePreview = signal<string | null>(null);
  readonly certifications = signal<CertificationInputDto[]>([]);
  readonly isEditing = computed(() => !!this.education());

  readonly stepsMeta = STEPS;
  readonly certificationTypes = Object.values(CertificationType);
  readonly certificationTypeMeta = CERTIFICATION_TYPE_META;
  protected readonly educationColor = TIMELINE_ITEM_TYPE_META[TimelineItemType.Education].color;
  readonly educationForm = this.fb.group({
    step1: this.fb.group({
      title: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: [null as Date | null, Validators.required],
      endDate: [null as Date | null],
    }),
    step2: this.fb.group({
      image: [null as File | null],
      institution: ['', Validators.required],
      location: ['', Validators.required],
    }),
  });

  readonly certificationControl = this.fb.group({
    title: [DEFAULT_CERTIFICATION.title, Validators.required],
    certificationType: [DEFAULT_CERTIFICATION.certificationType, Validators.required]
  });

  get s1(): FormGroup {
    return this.educationForm.get('step1') as FormGroup;
  }

  get s2(): FormGroup {
    return this.educationForm.get('step2') as FormGroup;
  }

  constructor() {
    effect(() => {
      const edu = this.education();
      if (!edu) return;
      this.s1.patchValue({
        title: edu.title,
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null
      });
      this.s2.patchValue({
        institution: edu.institution,
        location: edu.location,
        image: null
      });
      this.imagePreview.set(edu.image || null);
      this.certifications.set(
        edu.certifications?.map(cert => ({
          title: cert.title,
          certificationType: cert.certificationType
        })) || []
      );
      this.certificationControl.reset(DEFAULT_CERTIFICATION);
    });
  }

  next(): void {
    const current = this.getCurrentStepGroup();
    if (current?.invalid) {
      current.markAllAsTouched();
      return;
    }
    if (this.step() < this.stepsMeta.length - 1) {
      this.step.update(v => v + 1);
    }
  }

  prev(): void {
    if (this.step() > 0) {
      this.step.update(v => v - 1);
    }
  }

  addCertification(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.certificationControl.invalid) {
      this.certificationControl.markAllAsTouched();
      return;
    }

    this.certifications.update(certs => [...certs, this.certificationControl.value as CertificationInputDto]);
    this.certificationControl.reset(DEFAULT_CERTIFICATION);
  }

  removeCertification(index: number): void {
    this.certifications.update(certs => certs.filter((_, i) => i !== index));
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.s2.patchValue({image});

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(image);
  }

  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.markAllStepsAsTouched();
      this.step.set(this.s1.invalid ? 0 : 1);
      return;
    }

    const {step1, step2} = this.educationForm.getRawValue();
    const formData = toFormData({
      title: step1.title!.trim(),
      fieldOfStudy: step1.fieldOfStudy?.trim() || undefined,
      startDate: step1.startDate?.toISOString(),
      endDate: step1.endDate?.toISOString(),
      institution: step2.institution!.trim(),
      location: step2.location!.trim(),
      image: step2.image as File | null,
      certifications: this.certifications(),
    });

    this.isSubmitting.set(true);

    const operation$ = this.isEditing()
      ? this.consoleFacade.updateEducation(this.education()!.id, formData)
      : this.consoleFacade.addEducation(formData);

    operation$.subscribe({
      next: () => {
        const message = this.isEditing() ? 'Formation modifiée avec succès' : 'Formation créée avec succès';
        this.toastService.success(message);
        if (this.isEditing()) {
          this.isSubmitting.set(false);
          this.step.set(0);
        } else {
          this.resetForm();
        }
        this.saved.emit();
      },
      error: () => {
        const message = this.isEditing()
          ? 'Erreur lors de la modification de la formation'
          : 'Erreur lors de la création de la formation';
        this.toastService.error(message);
        this.markAllStepsAsTouched();
        this.isSubmitting.set(false);
      },
    });
  }

  private getCurrentStepGroup(): FormGroup | null {
    return this.educationForm.get(`step${this.step() + 1}`) as FormGroup | null;
  }

  private markAllStepsAsTouched(): void {
    this.s1.markAllAsTouched();
    this.s2.markAllAsTouched();
  }

  private resetForm(): void {
    this.educationForm.reset();
    this.certificationControl.reset(DEFAULT_CERTIFICATION);
    this.imagePreview.set(null);
    this.certifications.set([]);
    this.step.set(0);
    this.isSubmitting.set(false);
  }
}
