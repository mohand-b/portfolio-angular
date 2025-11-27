import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ContactService} from './state/contact/contact.service';
import {ContactMessageDto, ContactMessageResponseDto} from './state/contact/contact.model';
import {QuestionService} from './state/question/question.service';
import {CreateQuestionDto, QuestionResponseDto} from './state/question/question.model';

@Injectable({providedIn: 'root'})
export class ContactFacade {
  private readonly contactService = inject(ContactService);
  private readonly questionService = inject(QuestionService);

  sendMessage(dto: ContactMessageDto): Observable<ContactMessageResponseDto> {
    return this.contactService.sendMessage(dto);
  }

  askQuestion(dto: CreateQuestionDto): Observable<QuestionResponseDto> {
    return this.questionService.askQuestion(dto);
  }
}
