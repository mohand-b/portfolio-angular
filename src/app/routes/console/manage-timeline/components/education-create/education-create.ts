import {Component, inject, output, signal} from '@angular/core';
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
import {
  CERTIFICATION_TYPE_META,
  CertificationInputDto,
  CertificationType
} from '../../../../career/state/education/education.model';

@Component({
  selector: 'app-education-create',
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
  templateUrl: './education-create.html',
  styleUrl: './education-create.scss'
})
export class EducationCreate {
  private readonly fb = inject(FormBuilder);
  private readonly consoleFacade = inject(ConsoleFacade);

  readonly step = signal(0);
  readonly isSubmitting = signal(false);
  readonly imagePreview = signal<string | null>(null);
  readonly certifications = signal<CertificationInputDto[]>([]);
  readonly created = output<void>();

  readonly stepsMeta: StepConfig[] = [
    {icon: 'info', text: 'Informations'},
    {icon: 'business', text: 'Établissement'},
    {icon: 'workspace_premium', text: 'Diplômes'}
  ];

  readonly certificationTypes = Object.values(CertificationType);
  readonly certificationTypeMeta = CERTIFICATION_TYPE_META;

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
    title: ['', Validators.required],
    certificationType: [CertificationType.Academic, Validators.required]
  });

  get s1(): FormGroup {
    return this.educationForm.get('step1') as FormGroup;
  }

  get s2(): FormGroup {
    return this.educationForm.get('step2') as FormGroup;
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

    const certification: CertificationInputDto = this.certificationControl.value as CertificationInputDto;
    this.certifications.update(certs => [...certs, certification]);
    this.certificationControl.reset({
      title: '',
      certificationType: CertificationType.Academic
    });
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
    const payload = {
      title: step1.title!.trim(),
      fieldOfStudy: step1.fieldOfStudy ? step1.fieldOfStudy.trim() : undefined,
      startDate: step1.startDate ? step1.startDate.toISOString() : undefined,
      endDate: step1.endDate ? step1.endDate.toISOString() : undefined,
      institution: step2.institution!.trim(),
      location: step2.location!.trim(),
      image: step2.image as File | null,
      certifications: this.certifications(),
    };

    this.isSubmitting.set(true);
    this.consoleFacade.addEducation(toFormData(payload)).subscribe({
      next: () => {
        this.resetForm();
        this.created.emit();
      },
      error: () => {
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
    this.certificationControl.reset({
      title: '',
      certificationType: CertificationType.Academic
    });
    this.imagePreview.set(null);
    this.certifications.set([]);
    this.step.set(0);
    this.isSubmitting.set(false);
  }
}
