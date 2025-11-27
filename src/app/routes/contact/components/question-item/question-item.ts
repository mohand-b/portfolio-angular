import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {QuestionResponseDto, QuestionStatusEnum} from '../../state/question/question.model';

@Component({
  selector: 'app-question-item',
  imports: [DatePipe],
  templateUrl: './question-item.html',
  styleUrl: './question-item.scss'
})
export class QuestionItem {
  readonly question = input.required<QuestionResponseDto>();

  readonly QuestionStatusEnum = QuestionStatusEnum;

  private readonly statusLabels: Record<QuestionStatusEnum, string> = {
    [QuestionStatusEnum.PENDING]: 'En attente',
    [QuestionStatusEnum.ANSWERED]: 'Répondue',
    [QuestionStatusEnum.REJECTED]: 'Refusée'
  };

  private readonly statusColors: Record<QuestionStatusEnum, string> = {
    [QuestionStatusEnum.PENDING]: 'text-orange-600 bg-orange-50 border-orange-200',
    [QuestionStatusEnum.ANSWERED]: 'text-green-600 bg-green-50 border-green-200',
    [QuestionStatusEnum.REJECTED]: 'text-red-600 bg-red-50 border-red-200'
  };

  getStatusLabel(status: QuestionStatusEnum): string {
    return this.statusLabels[status] || '';
  }

  getStatusColor(status: QuestionStatusEnum): string {
    return this.statusColors[status] || '';
  }

  isMyQuestion(question: QuestionResponseDto): boolean {
    return question.status === QuestionStatusEnum.PENDING || question.status === QuestionStatusEnum.REJECTED;
  }
}
