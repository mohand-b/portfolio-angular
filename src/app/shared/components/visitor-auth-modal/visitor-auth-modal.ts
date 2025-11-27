import {Component, effect, HostListener, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {toSignal} from '@angular/core/rxjs-interop';
import {CoreFacade} from '../../../core/core.facade';
import {ToastService} from '../../services/toast.service';
import {AlertMessage} from '../alert-message/alert-message';

@Component({
  selector: 'app-visitor-auth-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AlertMessage
  ],
  templateUrl: './visitor-auth-modal.html',
  styleUrl: './visitor-auth-modal.scss'
})
export class VisitorAuthModal {
  private readonly dialogRef = inject(MatDialogRef<VisitorAuthModal>);
  private readonly coreFacade = inject(CoreFacade);
  private readonly toastService = inject(ToastService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly authForm = inject(FormBuilder).group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  private readonly formChanges = toSignal(this.authForm.valueChanges);

  constructor() {
    effect(() => {
      this.formChanges();
      if (this.errorMessage()) {
        this.errorMessage.set(null);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.authForm.invalid && !this.isSubmitting()) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.authForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.coreFacade.authenticateVisitor({
      firstName: this.authForm.value.firstName!,
      lastName: this.authForm.value.lastName!,
      email: this.authForm.value.email!
    }).subscribe({
      next: (response) => {
        this.toastService.success('Authentification réussie');
        if (response.message) {
          setTimeout(() => this.toastService.warning(response.message!));
        }
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || err.message || 'Erreur lors de l\'authentification');
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
