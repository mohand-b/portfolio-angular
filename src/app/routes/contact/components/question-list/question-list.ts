import {Component, input} from '@angular/core';
import {QuestionResponseDto} from '../../state/question/question.model';
import {QuestionItem} from '../question-item/question-item';

@Component({
  selector: 'app-question-list',
  imports: [QuestionItem],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss'
})
export class QuestionList {
  readonly questions = input.required<QuestionResponseDto[]>();
  readonly isLoading = input<boolean>(false);
}
