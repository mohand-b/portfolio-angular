import {Component, inject, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {toFormData} from '../../../../../shared/extensions/object.extension';

@Component({
  selector: 'app-education-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './education-create.html',
  styleUrl: './education-create.scss'
})
export class EducationCreate {
  readonly created = output<void>();

  private fb = inject(FormBuilder);
  private consoleFacade = inject(ConsoleFacade);

  imagePreview = signal<string | null>(null);

  educationForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    institution: ['', Validators.required],
    location: ['', Validators.required],
    fieldOfStudy: [''],
    startDate: [null],
    endDate: [null, Validators.required],
    image: [null as File | null],
  });

  onSubmit() {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const formData = toFormData(this.educationForm.value);

    this.consoleFacade.addEducation(formData).subscribe({
      next: () => {
        this.resetForm();
        this.created.emit();
      },
      error: () => this.educationForm.markAllAsTouched(),
    });
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.educationForm.patchValue({image});

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(image);
  }

  private resetForm() {
    this.educationForm.reset();
    this.imagePreview.set(null);
  }
}
