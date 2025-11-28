import {Component, computed, inject, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {environment} from '../../../../../../environments/environments';
import {CoreFacade} from '../../../../core/core.facade';
import {ContactFacade} from '../../contact.facade';
import {
  CreateQuestionDto,
  PaginatedQuestionsResponseDto,
  QuestionResponseDto,
  QuestionStatusEnum
} from '../../state/question/question.model';
import {ModalService} from '../../../../shared/services/modal.service';
import {VisitorAuthModal} from '../../../../shared/components/visitor-auth-modal/visitor-auth-modal';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {ToastService} from '../../../../shared/services/toast.service';
import {QuestionList} from '../../components/question-list/question-list';

@Component({
  selector: 'app-questions-answers',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    AlertMessage,
    QuestionList
  ],
  templateUrl: './questions-answers.html',
  styleUrl: './questions-answers.scss'
})
export class QuestionsAnswers {
  private readonly coreFacade = inject(CoreFacade);
  private readonly contactFacade = inject(ContactFacade);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);

  readonly isAuthenticated = this.coreFacade.isVisitorAuthenticated;
  readonly isVerified = this.coreFacade.isVisitorVerified;
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  private readonly newQuestions = signal<QuestionResponseDto[]>([]);
  private readonly questionsResource = httpResource<PaginatedQuestionsResponseDto>(() => {
    this.isAuthenticated();
    return {
      url: `${environment.baseUrl}/questions/list?page=1&limit=10`,
      method: 'GET',
      withCredentials: true
    };
  });

  readonly questions = computed(() => [...this.newQuestions(), ...(this.questionsResource.value()?.data ?? [])]);
  readonly isLoadingQuestions = computed(() => this.questionsResource.isLoading());
  readonly hasPendingQuestion = computed(() =>
    this.questions().some(q => q.status === QuestionStatusEnum.PENDING || q.status === QuestionStatusEnum.REJECTED)
  );

  readonly form = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    isAnonymous: new FormControl(false)
  });

  openAuthModal(): void {
    this.modalService.open(VisitorAuthModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting() || !this.isAuthenticated() || !this.isVerified()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const dto: CreateQuestionDto = {
      content: this.form.value.content!,
      isAnonymous: this.form.value.isAnonymous ?? false
    };

    this.contactFacade.askQuestion(dto).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.toastService.success('Votre question a été envoyée avec succès !');
        this.form.reset({isAnonymous: false});
        this.newQuestions.update(questions => [response, ...questions]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(err.error?.message || 'Une erreur est survenue');
      }
    });
  }
}
