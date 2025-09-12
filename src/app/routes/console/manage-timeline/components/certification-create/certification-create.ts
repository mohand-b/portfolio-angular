import {Component, inject, input, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {toFormData} from '../../../../../shared/extensions/object.extension';


@Component({
  selector: 'app-certification-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './certification-create.html',
  styleUrl: './certification-create.scss'
})
export class CertificationCreate {

  readonly created = output<void>();
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
  private consoleFacade = inject(ConsoleFacade);

  onSubmit() {
    if (this.certificationForm.invalid) {
      this.certificationForm.markAllAsTouched();
      return;
    }

    this.consoleFacade.addCertification(toFormData(this.certificationForm.value)).subscribe({
      next: () => {
        this.created.emit();
        this.certificationForm.reset();
        this.imagePreview.set(null);
      },
      error: () => this.certificationForm.markAsTouched(),
    });
  }


  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const image = input.files?.[0];
    if (!image) return;

    this.certificationForm.patchValue({image});

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(image);
  }
}
