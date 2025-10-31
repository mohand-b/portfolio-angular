import {Component, inject, input, output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {CreateJobDto} from '../../../../career/state/job/job.model';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ConsoleFacade} from '../../../console.facade';
import {toFormData} from '../../../../../shared/extensions/object.extension';

@Component({
  selector: 'app-job-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  templateUrl: './job-create.html',
  styleUrl: './job-create.scss',
})
export class JobCreate {
  readonly step = signal(0);
  readonly stepsMeta = [
    {icon: 'work', label: 'Étape 1 : Poste'},
    {icon: 'apartment', label: 'Étape 2 : Société'},
    {icon: 'format_list_bulleted', label: 'Étape 3 : Missions'},
  ] as const;
  jobSubmit = output<CreateJobDto>();
  imagePreview = signal<string | null>(null);
  missions: WritableSignal<string[]> = signal([]);
  readonly created = output<void>();
  readonly isSubmitting = signal(false);
  protected readonly focus = focus;
  private consoleFacade = inject(ConsoleFacade);
  private fb = inject(FormBuilder);
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
  missionControl = this.fb.control('');

  get s1(): FormGroup {
    return this.getStepGroup(0)!;
  }

  get s2(): FormGroup {
    return this.getStepGroup(1)!;
  }

  next() {
    const idx = this.step();
    const current = this.getStepGroup(idx);
    if (current && current.invalid) {
      current.markAllAsTouched();
      return;
    }
    if (idx < this.stepsMeta.length - 1) {
      this.step.update(v => v + 1);
    }
  }

  prev() {
    if (this.step() > 0) this.step.update(v => v - 1);
  }

  addMission(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const v = (this.missionControl.value ?? '').trim();
    if (!v) return;
    this.missions.update(arr => [...arr, v]);
    this.missionControl.reset('');
  }

  removeMission(i: number) {
    this.missions.update(arr => arr.filter((_, idx) => idx !== i));
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.s2.patchValue({image});

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(image);
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      this.s1.markAllAsTouched();
      this.s2.markAllAsTouched();

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
        this.created.emit();
        this.jobForm.reset();
        this.missions.set([]);
        this.missionControl.reset('');
        this.imagePreview.set(null);
        this.step.set(0);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.s1.markAllAsTouched();
        this.s2.markAllAsTouched();
        this.isSubmitting.set(false);
      },
    });
  }

  private getStepGroup(idx: number): FormGroup | null {
    return this.jobForm.get(`step${idx + 1}`) as FormGroup | null;
  }
}
