import {Component, input, output, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {QuestionResponseDto, QuestionStatusEnum} from '../../../../contact/state/question/question.model';
import {SvgSafePipe} from '../../../../../shared/pipes/svg-safe.pipe';
import {TimeAgoPipe} from '../../../../../shared/pipes/time-ago.pipe';

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
  templateUrl: './question-admin-item.html',
  styleUrl: './question-admin-item.scss'
})
export class QuestionAdminItem {
  readonly question = input.required<QuestionResponseDto>();
  readonly answerSubmitted = output<{question: QuestionResponseDto; answer: string}>();
  readonly rejectSubmitted = output<{question: QuestionResponseDto; reason: string}>();

  protected readonly QuestionStatusEnum = QuestionStatusEnum;
  protected readonly showAnswerForm = signal(false);
  protected readonly showRejectForm = signal(false);

  protected readonly answerControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);
  protected readonly rejectControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);

  protected readonly statusConfig = {
    [QuestionStatusEnum.PENDING]: {
      label: 'En attente',
      class: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    [QuestionStatusEnum.ANSWERED]: {
      label: 'Répondue',
      class: 'bg-green-100 text-green-800 border-green-200'
    },
    [QuestionStatusEnum.REJECTED]: {
      label: 'Rejetée',
      class: 'bg-red-100 text-red-800 border-red-200'
    }
  };

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

    this.answerSubmitted.emit({
      question: this.question(),
      answer: this.answerControl.value!
    });
    this.resetForm();
  }

  protected onSubmitReject(): void {
    this.rejectControl.markAsTouched();
    if (!this.rejectControl.valid) return;

    this.rejectSubmitted.emit({
      question: this.question(),
      reason: this.rejectControl.value!
    });
    this.resetForm();
  }

  protected onCancel(): void {
    this.resetForm();
  }

  protected getInitials(): string {
    const visitor = this.question().visitor;
    if (!visitor?.username) return '?';
    return visitor.username.charAt(0).toUpperCase();
  }

  private resetForm(): void {
    this.showAnswerForm.set(false);
    this.showRejectForm.set(false);
    this.answerControl.reset();
    this.rejectControl.reset();
  }
}
