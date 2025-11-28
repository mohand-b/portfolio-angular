import {Component, computed, inject, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {tap} from 'rxjs';
import {environment} from '../../../../../../../environments/environments';
import {QuestionAdminItem} from '../../components/question-admin-item/question-admin-item';
import {Pagination} from '../../../../../shared/components/pagination/pagination';
import {ConsoleFacade} from '../../../console.facade';
import {ToastService} from '../../../../../shared/services/toast.service';
import {PaginatedQuestionsResponseDto, QuestionResponseDto, QuestionStatsResponseDto, QuestionStatusEnum} from '../../../../contact/state/question/question.model';

@Component({
  selector: 'app-manage-questions',
  imports: [
    MatIconModule,
    QuestionAdminItem,
    Pagination
  ],
  templateUrl: './manage-questions.html',
  styleUrl: './manage-questions.scss'
})
export class ManageQuestions {
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly page = signal(1);
  readonly limit = signal(10);
  readonly statusFilter = signal<string | null>(null);

  private readonly questionsResource = httpResource<PaginatedQuestionsResponseDto>(() => {
    const currentPage = this.page();
    const currentLimit = this.limit();
    const status = this.statusFilter();
    const statusParam = status ? `&status=${status}` : '';
    return {
      url: `${environment.baseUrl}/questions/admin/list?page=${currentPage}&limit=${currentLimit}${statusParam}`,
      method: 'GET'
    };
  });

  private readonly statsResource = httpResource<QuestionStatsResponseDto>(() => {
    return {
      url: `${environment.baseUrl}/questions/stats`,
      method: 'GET'
    };
  });

  private readonly questionsOverride = signal<QuestionResponseDto[] | null>(null);
  readonly questions = computed(() => {
    const override = this.questionsOverride();
    if (override !== null) return override;
    return this.questionsResource.value()?.data ?? [];
  });
  readonly isLoading = computed(() => this.questionsResource.isLoading());
  readonly totalPages = computed(() => this.questionsResource.value()?.meta?.totalPages ?? 1);

  private readonly statsSignal = signal<QuestionStatsResponseDto | null>(null);
  readonly stats = computed(() => {
    const optimisticStats = this.statsSignal();
    if (optimisticStats) return optimisticStats;
    return this.statsResource.value() ?? {pending: 0, answered: 0, rejected: 0, total: 0};
  });

  onAnswerSubmitted(data: { question: QuestionResponseDto, answer: string }): void {
    const currentStats = this.stats();
    this.statsSignal.set({
      ...currentStats,
      pending: currentStats.pending - 1,
      answered: currentStats.answered + 1
    });

    this.updateQuestionsList(data.question.id, 'answered', {
      status: QuestionStatusEnum.ANSWERED,
      answer: data.answer
    });

    this.consoleFacade.answerQuestion(data.question.id, {answer: data.answer})
      .pipe(tap(() => this.toastService.success('Réponse envoyée avec succès')))
      .subscribe({
        error: () => {
          this.toastService.error('Erreur lors de l\'envoi de la réponse');
          this.rollback(currentStats);
        }
      });
  }

  onRejectSubmitted(data: { question: QuestionResponseDto, reason: string }): void {
    const currentStats = this.stats();
    this.statsSignal.set({
      ...currentStats,
      pending: currentStats.pending - 1,
      rejected: currentStats.rejected + 1
    });

    this.updateQuestionsList(data.question.id, 'rejected', {
      status: QuestionStatusEnum.REJECTED,
      rejectionReason: data.reason
    });

    this.consoleFacade.rejectQuestion(data.question.id, {rejectionReason: data.reason})
      .pipe(tap(() => this.toastService.success('Question rejetée')))
      .subscribe({
        error: () => {
          this.toastService.error('Erreur lors du rejet');
          this.rollback(currentStats);
        }
      });
  }

  onFilterByStatus(status: string): void {
    if (this.statusFilter() === status) {
      this.statusFilter.set(null);
    } else {
      this.statusFilter.set(status);
    }
    this.page.set(1);
    this.questionsOverride.set(null);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.questionsOverride.set(null);
  }

  onPreviousPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.questionsOverride.set(null);
    }
  }

  onNextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.questionsOverride.set(null);
    }
  }

  private updateQuestionsList(questionId: string, newStatus: string, updates: Partial<QuestionResponseDto>): void {
    const currentQuestions = this.questions();
    const filter = this.statusFilter();

    const updatedQuestions = filter && filter !== newStatus
      ? currentQuestions.filter(q => q.id !== questionId)
      : currentQuestions.map(q => q.id === questionId ? {...q, ...updates} : q);

    this.questionsOverride.set(updatedQuestions);
  }

  private rollback(stats: QuestionStatsResponseDto): void {
    this.statsSignal.set(stats);
    this.questionsOverride.set(null);
  }
}
