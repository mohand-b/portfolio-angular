import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {CoreFacade} from '../../../core/core.facade';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-visitor-auth-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './visitor-auth-modal.html',
  styleUrl: './visitor-auth-modal.scss'
})
export class VisitorAuthModal {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<VisitorAuthModal>);
  private coreFacade = inject(CoreFacade);
  private toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly authForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    this.authForm.valueChanges.subscribe(() => {
      if (this.errorMessage()) {
        this.errorMessage.set(null);
      }
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const formValue = this.authForm.value;

    this.coreFacade.authenticateVisitor({
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email!
    }).subscribe({
      next: (response) => {
        const message = response.message;
        this.toastService.success('Authentification réussie');
        if (message) setTimeout(() => this.toastService.warning(message), 2000);
        this.dialogRef.close(true);
      },
      error: (err) => {
        const message = err.error?.message || err.message || 'Erreur lors de l\'authentification';
        this.errorMessage.set(message);
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
