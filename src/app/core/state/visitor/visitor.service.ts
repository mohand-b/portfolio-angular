import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {Visitor, VisitorAuthDto, VisitorAuthResponseDto} from './visitor.model';

@Injectable({providedIn: 'root'})
export class VisitorService {

  private http = inject(HttpClient);
  private readonly visitorBaseUrl = `${environment.baseUrl}/visitor`;

  authenticate(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.http.post<VisitorAuthResponseDto>(this.visitorBaseUrl, authDto);
  }

  getMe(): Observable<Visitor> {
    return this.http.get<Visitor>(`${this.visitorBaseUrl}/me`);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.visitorBaseUrl}/${id}`);
  }


  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.visitorBaseUrl}/verify`, {
      params: {token}
    });
  }
}
