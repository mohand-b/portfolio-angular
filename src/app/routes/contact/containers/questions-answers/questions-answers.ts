import {Component, computed, inject, PLATFORM_ID, signal} from '@angular/core';
import {HttpClient, httpResource} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {finalize, tap} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {CoreFacade} from '../../../../core/core.facade';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {VisitorAuthModal} from '../../../../shared/components/visitor-auth-modal/visitor-auth-modal';
import {SvgSafePipe} from '../../../../shared/pipes/svg-safe.pipe';
import {ModalService} from '../../../../shared/services/modal.service';
import {ToastService} from '../../../../shared/services/toast.service';
import {QuestionList} from '../../components/question-list/question-list';
import {ContactFacade} from '../../contact.facade';
import {CreateQuestionDto, PaginatedQuestionsResponseDto, QuestionResponseDto, QuestionStatusEnum} from '../../state/question/question.model';

@Component({
  selector: 'app-questions-answers',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSlideToggleModule, AlertMessage, QuestionList, SvgSafePipe],
  templateUrl: './questions-answers.html',
  styleUrl: './questions-answers.scss'
})
export class QuestionsAnswers {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly coreFacade = inject(CoreFacade);
  private readonly contactFacade = inject(ContactFacade);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);

  readonly limit = 5;
  readonly form = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    isAnonymous: new FormControl(false)
  });

  readonly incognitoSvg = toSignal(this.http.get('/assets/svg/incognito.svg', {responseType: 'text'}), {initialValue: ''});
  readonly isAuthenticated = this.coreFacade.isVisitorAuthenticated;
  readonly isVerified = this.coreFacade.isVisitorVerified;
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly currentPage = signal(1);

  private readonly newQuestions = signal<QuestionResponseDto[]>([]);
  private readonly isBrowserReady = signal(false);
  private readonly questionsResource = httpResource<PaginatedQuestionsResponseDto>(() => {
    if (!this.isBrowser || !this.isBrowserReady()) return undefined;
    this.isAuthenticated();
    return {
      url: `${environment.baseUrl}/questions/list?page=${this.currentPage()}&limit=${this.limit}`,
      method: 'GET',
      withCredentials: true
    };
  });

  readonly questions = computed(() => {
    const fromResource = this.questionsResource.value()?.data ?? [];
    return this.currentPage() === 1 ? [...this.newQuestions(), ...fromResource] : fromResource;
  });
  readonly isLoadingQuestions = computed(() => this.questionsResource.isLoading());
  readonly totalPages = computed(() => this.questionsResource.value()?.meta?.totalPages ?? 1);
  readonly hasPendingQuestion = computed(() => this.questions().some(q => q.status === QuestionStatusEnum.PENDING));

  constructor() {
    if (this.isBrowser) {
      setTimeout(() => this.isBrowserReady.set(true), 0);
    }
  }

  openAuthModal(): void {
    this.modalService.open(VisitorAuthModal, {width: '500px', maxWidth: '90vw', disableClose: true});
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting() || !this.isAuthenticated() || !this.isVerified()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    this.contactFacade.askQuestion({
      content: this.form.value.content!,
      isAnonymous: this.form.value.isAnonymous ?? false
    }).pipe(
      tap(response => {
        this.toastService.success('Votre question a été envoyée avec succès !');
        this.form.reset({isAnonymous: false});
        this.newQuestions.update(questions => [response, ...questions]);
        this.currentPage.set(1);
      }),
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      error: err => this.submitError.set(err.error?.message || 'Une erreur est survenue')
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onPreviousPage(): void {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }

  onNextPage(): void {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }
}
