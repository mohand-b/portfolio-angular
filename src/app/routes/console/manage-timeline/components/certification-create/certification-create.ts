import {Component, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormFieldStyleDirective} from '../../../../../shared/directives/form-field-style.directive';
import {CreateCertificationDto} from '../../../../career/state/certification/certification.model';
import {TimelineItemType} from '../../../../career/state/timeline/timeline.model';


@Component({
  selector: 'app-certification-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    FormFieldStyleDirective
  ],
  templateUrl: './certification-create.html',
  styleUrl: './certification-create.scss'
})
export class CertificationCreate {
  resetForm = input(0);
  certificationSubmit = output<CreateCertificationDto>();
  imagePreview = signal<string | null>(null);

  private fb = inject(FormBuilder);

  certificationForm: FormGroup = this.fb.group({
    certificationName: ['', Validators.required],
    startDate: [null],
    endDate: [null, Validators.required],
    school: ['', Validators.required],
    location: ['', Validators.required],
    image: [null as File | null],
  });

  private readonly resetFormEffect = effect(() => {
    const token = this.resetForm();
    this.certificationForm.reset({type: TimelineItemType.Job});
    this.imagePreview.set(null);
  });

  onSubmit() {
    this.certificationForm.markAllAsTouched();
    if (!this.certificationForm.valid) return;

    this.certificationSubmit.emit(this.certificationForm.value);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.certificationForm.patchValue({image: file});
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


}
