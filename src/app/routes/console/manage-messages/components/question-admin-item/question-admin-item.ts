import {Component, inject, input, output, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {SvgSafePipe} from '../../../../../shared/pipes/svg-safe.pipe';
import {TimeAgoPipe} from '../../../../../shared/pipes/time-ago.pipe';
import {QuestionResponseDto, QuestionStatusEnum} from '../../../../contact/state/question/question.model';

@Component({
  selector: 'app-question-admin-item',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TimeAgoPipe,
    SvgSafePipe
  ],
  templateUrl: './question-admin-item.html'
})
export class QuestionAdminItem {
  private readonly http = inject(HttpClient);

  protected readonly QuestionStatusEnum = QuestionStatusEnum;
  protected readonly statusConfig = {
    [QuestionStatusEnum.PENDING]: {label: 'En attente', class: 'text-orange-600 bg-orange-50 border-orange-200'},
    [QuestionStatusEnum.ANSWERED]: {label: 'Répondue', class: 'text-green-600 bg-green-50 border-green-200'},
    [QuestionStatusEnum.REJECTED]: {label: 'Refusée', class: 'text-red-600 bg-red-50 border-red-200'}
  };

  readonly question = input.required<QuestionResponseDto>();
  readonly answerSubmitted = output<{question: QuestionResponseDto; answer: string}>();
  readonly rejectSubmitted = output<{question: QuestionResponseDto; reason: string}>();

  readonly incognitoSvg = toSignal(
    this.http.get('/assets/svg/incognito.svg', {responseType: 'text'}),
    {initialValue: ''}
  );

  protected readonly showAnswerForm = signal(false);
  protected readonly showRejectForm = signal(false);
  protected readonly answerControl = new FormControl('', [Validators.required, Validators.minLength(10)]);
  protected readonly rejectControl = new FormControl('', [Validators.required, Validators.minLength(10)]);

  protected toggleAnswerForm(): void {
    this.showAnswerForm.update(v => !v);
    this.showRejectForm.set(false);
    this.rejectControl.reset();
  }

  protected toggleRejectForm(): void {
    this.showRejectForm.update(v => !v);
    this.showAnswerForm.set(false);
    this.answerControl.reset();
  }

  protected onSubmitAnswer(): void {
    this.answerControl.markAsTouched();
    if (!this.answerControl.valid) return;
    this.answerSubmitted.emit({question: this.question(), answer: this.answerControl.value!});
    this.resetForm();
  }

  protected onSubmitReject(): void {
    this.rejectControl.markAsTouched();
    if (!this.rejectControl.valid) return;
    this.rejectSubmitted.emit({question: this.question(), reason: this.rejectControl.value!});
    this.resetForm();
  }

  protected onCancel(): void {
    this.resetForm();
  }

  protected getInitials(): string {
    return this.question().visitor?.username?.charAt(0)?.toUpperCase() || '?';
  }

  private resetForm(): void {
    this.showAnswerForm.set(false);
    this.showRejectForm.set(false);
    this.answerControl.reset();
    this.rejectControl.reset();
  }
}
