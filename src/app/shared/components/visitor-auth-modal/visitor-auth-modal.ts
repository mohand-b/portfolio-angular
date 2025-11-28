import {Component, HostListener, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {finalize, tap} from 'rxjs';
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

  constructor() {
    this.authForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
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

    const {firstName, lastName, email} = this.authForm.value;

    this.coreFacade.authenticateVisitor({
      firstName: firstName!,
      lastName: lastName!,
      email: email!
    }).pipe(
      tap(response => {
        this.toastService.success('Authentification réussie');
        if (response.message) {
          setTimeout(() => this.toastService.warning(response.message!));
        }
        this.dialogRef.close(true);
      }),
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      error: err => {
        const message = err?.error?.message || err?.message || 'Erreur lors de l\'authentification';
        this.errorMessage.set(message);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
