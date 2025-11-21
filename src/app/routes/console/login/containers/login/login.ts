import {Component, HostListener, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CoreFacade} from '../../../../../core/core.facade';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly router = inject(Router);
  private readonly coreFacade = inject(CoreFacade);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  @HostListener('document:keydown', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.form.invalid && !this.form.disabled) {
      event.preventDefault();
      this.login();
    }
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();
    const {email, password} = this.form.value;

    this.coreFacade.loginAdmin({email, password}).subscribe({
      next: () => this.router.navigate(['/console']),
      error: () => this.form.enable(),
      complete: () => this.form.enable(),
    });
  }
}
