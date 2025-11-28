import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {AnswerQuestionDto, CreateQuestionDto, QuestionResponseDto, QuestionStatsResponseDto, RejectQuestionDto} from './question.model';

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

  answerQuestion(id: string, dto: AnswerQuestionDto): Observable<QuestionResponseDto> {
    return this.http.patch<QuestionResponseDto>(`${this.baseUrl}/${id}/answer`, dto);
  }

  rejectQuestion(id: string, dto: RejectQuestionDto): Observable<QuestionResponseDto> {
    return this.http.patch<QuestionResponseDto>(`${this.baseUrl}/${id}/reject`, dto);
  }

  getStats(): Observable<QuestionStatsResponseDto> {
    return this.http.get<QuestionStatsResponseDto>(`${this.baseUrl}/stats`, {withCredentials: true});
  }
}
