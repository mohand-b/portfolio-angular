import {Component, inject, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {StepConfig, Stepper} from '../../../../../shared/components/stepper/stepper';
import {ConsoleFacade} from '../../../console.facade';

@Component({
  selector: 'app-job-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    Stepper,
  ],
  templateUrl: './job-create.html',
  styleUrl: './job-create.scss',
})
export class JobCreate {
  private readonly fb = inject(FormBuilder);
  private readonly consoleFacade = inject(ConsoleFacade);

  readonly step = signal(0);
  readonly isSubmitting = signal(false);
  readonly imagePreview = signal<string | null>(null);
  readonly missions = signal<string[]>([]);
  readonly created = output<void>();

  readonly stepsMeta: StepConfig[] = [
    {icon: 'work', text: 'Poste'},
    {icon: 'apartment', text: 'Société'},
    {icon: 'format_list_bulleted', text: 'Missions'},
  ];

  readonly jobForm = this.fb.group({
    step1: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      startDate: [null as Date | null, Validators.required],
      endDate: [null as Date | null],
    }),
    step2: this.fb.group({
      company: ['', Validators.required],
      location: ['', Validators.required],
      image: [null as File | null],
    }),
  });

  readonly missionControl = this.fb.control('');

  get s1(): FormGroup {
    return this.jobForm.get('step1') as FormGroup;
  }

  get s2(): FormGroup {
    return this.jobForm.get('step2') as FormGroup;
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

  addMission(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const value = (this.missionControl.value ?? '').trim();
    if (!value) return;
    this.missions.update(arr => [...arr, value]);
    this.missionControl.reset('');
  }

  removeMission(index: number): void {
    this.missions.update(arr => arr.filter((_, i) => i !== index));
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
    if (this.jobForm.invalid) {
      this.markAllStepsAsTouched();
      this.step.set(this.s1.invalid ? 0 : 1);
      return;
    }

    const {step1, step2} = this.jobForm.getRawValue();
    const payload = {
      title: step1.title!.trim(),
      startDate: step1.startDate!.toISOString(),
      endDate: step1.endDate ? step1.endDate.toISOString() : null,
      company: step2.company!.trim(),
      location: step2.location!.trim(),
      missions: this.missions(),
      image: step2.image as File | null,
    };

    this.isSubmitting.set(true);
    this.consoleFacade.addJob(toFormData(payload)).subscribe({
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
    return this.jobForm.get(`step${this.step() + 1}`) as FormGroup | null;
  }

  private markAllStepsAsTouched(): void {
    this.s1.markAllAsTouched();
    this.s2.markAllAsTouched();
  }

  private resetForm(): void {
    this.jobForm.reset();
    this.missions.set([]);
    this.missionControl.reset('');
    this.imagePreview.set(null);
    this.step.set(0);
    this.isSubmitting.set(false);
  }
}
