import {Component, effect, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {CoreFacade} from '../../../../core/core.facade';
import {ContactFacade} from '../../contact.facade';
import {ContactMessageDto} from '../../state/contact/contact.model';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AlertMessage
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactForm {
  private readonly coreFacade = inject(CoreFacade);
  private readonly contactFacade = inject(ContactFacade);
  private readonly toastService = inject(ToastService);

  readonly visitor = this.coreFacade.visitor;
  readonly isAuthenticated = this.coreFacade.isVisitorAuthenticated;

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  constructor() {
    effect(() => {
      const visitor = this.visitor();
      if (visitor) {
        this.form.patchValue({
          firstName: visitor.firstName,
          lastName: visitor.lastName,
          email: visitor.email
        });
        this.form.get('firstName')?.disable();
        this.form.get('lastName')?.disable();
        this.form.get('email')?.disable();
      } else {
        this.form.get('firstName')?.enable();
        this.form.get('lastName')?.enable();
        this.form.get('email')?.enable();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const formValue = this.form.getRawValue();
    const dto: ContactMessageDto = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email!,
      subject: formValue.subject!,
      message: formValue.message!
    };

    this.contactFacade.sendMessage(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastService.success('Votre message a été envoyé avec succès !');
        this.form.get('subject')?.reset();
        this.form.get('message')?.reset();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(err.error?.message || 'Une erreur est survenue');
      }
    });
  }
}
