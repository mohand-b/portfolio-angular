import {Component, input, output} from '@angular/core';
import {QuestionResponseDto} from '../../state/question/question.model';
import {QuestionItem} from '../question-item/question-item';
import {Pagination} from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-question-list',
  imports: [QuestionItem, Pagination],
  templateUrl: './question-list.html'
})
export class QuestionList {
  readonly questions = input.required<QuestionResponseDto[]>();
  readonly isLoading = input<boolean>(false);
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);

  readonly pageChange = output<number>();
  readonly previousPage = output<void>();
  readonly nextPage = output<void>();
}
