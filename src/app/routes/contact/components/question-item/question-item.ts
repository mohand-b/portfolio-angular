import {Component, computed, inject, input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {CoreFacade} from '../../../../core/core.facade';
import {TimeAgoPipe} from '../../../../shared/pipes/time-ago.pipe';
import {SvgSafePipe} from '../../../../shared/pipes/svg-safe.pipe';
import {QuestionResponseDto, QuestionStatusEnum} from '../../state/question/question.model';

@Component({
  selector: 'app-question-item',
  imports: [TimeAgoPipe, SvgSafePipe],
  templateUrl: './question-item.html',
  styleUrl: './question-item.scss'
})
export class QuestionItem {
  private readonly http = inject(HttpClient);
  private readonly coreFacade = inject(CoreFacade);

  protected readonly QuestionStatusEnum = QuestionStatusEnum;
  protected readonly statusLabels: Record<QuestionStatusEnum, string> = {
    [QuestionStatusEnum.PENDING]: 'En attente',
    [QuestionStatusEnum.ANSWERED]: 'Répondue',
    [QuestionStatusEnum.REJECTED]: 'Refusée'
  };
  protected readonly statusColors: Record<QuestionStatusEnum, string> = {
    [QuestionStatusEnum.PENDING]: 'text-orange-600 bg-orange-50 border-orange-200',
    [QuestionStatusEnum.ANSWERED]: 'text-green-600 bg-green-50 border-green-200',
    [QuestionStatusEnum.REJECTED]: 'text-red-600 bg-red-50 border-red-200'
  };

  readonly question = input.required<QuestionResponseDto>();
  readonly incognitoSvg = toSignal(
    this.http.get('/assets/svg/incognito.svg', {responseType: 'text'}),
    {initialValue: ''}
  );

  readonly isMyQuestion = computed(() => {
    const visitor = this.coreFacade.visitor();
    return visitor?.id != null && visitor.id === this.question().visitor?.id;
  });

  readonly displayName = computed(() => {
    const {isAnonymous, visitor} = this.question();
    const isMine = this.isMyQuestion();
    const username = visitor?.username || 'Visiteur';

    if (isAnonymous) return isMine ? 'Anonyme (vous)' : 'Anonyme';
    return isMine ? `${username} (vous)` : username;
  });

  protected getStatusLabel(status: QuestionStatusEnum): string {
    return this.statusLabels[status];
  }

  protected getStatusColor(status: QuestionStatusEnum): string {
    return this.statusColors[status];
  }
}
