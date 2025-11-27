import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {CreateQuestionDto, QuestionResponseDto} from './question.model';

@Injectable({providedIn: 'root'})
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/questions`;

  askQuestion(dto: CreateQuestionDto): Observable<QuestionResponseDto> {
    return this.http.post<QuestionResponseDto>(
      this.baseUrl,
      dto,
      {withCredentials: true}
    );
  }
}
