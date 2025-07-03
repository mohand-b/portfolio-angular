import {Component, effect, inject, input, output, signal, WritableSignal} from '@angular/core';
import {TimelineItemType} from '../../../career/state/timeline/timeline.model';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormFieldStyleDirective} from '../../../../shared/directives/form-field-style.directive';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {JobCreateDto} from '../../../career/state/job/job.model';

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
    FormFieldStyleDirective
  ],
  templateUrl: './job-create.html',
  styleUrl: './job-create.scss',
})
export class JobCreate {
  resetForm = input(false);
  jobSubmit = output<JobCreateDto>();
  imagePreview = signal<string | null>(null);
  missions: WritableSignal<string[]> = signal([]);
  private fb = inject(FormBuilder);
  jobForm = this.fb.group({
    title: ['', Validators.required],
    company: ['', Validators.required],
    location: ['', Validators.required],
    startDate: [null, Validators.required],
    endDate: [null],
    description: [''],
    type: [TimelineItemType.Job],
    image: [null as File | null],
  });
  missionFormControl = this.fb.control('');

  private readonly resetFormEffect = effect(() => {
    if (this.resetForm()) {
      this.jobForm.reset({type: TimelineItemType.Job});
      this.missions.set([]);
      this.missionFormControl.reset();
      this.imagePreview.set(null);
    }
  });

  addMission() {
    const value = this.missionFormControl.value?.trim();
    if (value) {
      this.missions.set([...this.missions(), value]);
      this.missionFormControl.reset();
    }
  }

  removeMission(i: number) {
    const arr = [...this.missions()];
    arr.splice(i, 1);
    this.missions.set(arr);
  }

  onMissionInputKeyup(event: any) {
    if (event.key === 'Enter' && this.missionFormControl.valid) {
      event.preventDefault();
      event.stopPropagation();
      this.addMission();
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.jobForm.patchValue({image: file});
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.jobForm.markAllAsTouched();
    if (!this.jobForm.valid) return;

    const job: JobCreateDto = {
      ...this.jobForm.value,
      missions: this.missions(),
    } as JobCreateDto;

    this.jobSubmit.emit(job);
  }

}
