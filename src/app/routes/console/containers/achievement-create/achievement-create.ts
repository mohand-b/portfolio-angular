import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ConsoleFacade} from '../../console.facade';
import {FormFieldStyleDirective} from '../../../../shared/directives/form-field-style.directive';

@Component({
  selector: 'app-achievement-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormFieldStyleDirective
  ],
  templateUrl: './achievement-create.html',
  styleUrl: './achievement-create.scss'
})
export class AchievementCreate {
  private consoleFacade = inject(ConsoleFacade);

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    label: ['', Validators.required],
    description: ['']
  });

  addAchievement() {
    if (this.form.invalid) return;

    this.consoleFacade.createAchievement(this.form.value).subscribe({
      next: () => this.form.reset(),
      error: () => this.form.markAsTouched(),
    });
  }

  onCodeInput() {
    const codeCtrl = this.form.get('code');
    if (!codeCtrl) return;
    const value = codeCtrl.value?.toUpperCase().slice(0, 5) ?? '';
    if (value !== codeCtrl.value) {
      codeCtrl.setValue(value, {emitEvent: false});
    }
  }

}
