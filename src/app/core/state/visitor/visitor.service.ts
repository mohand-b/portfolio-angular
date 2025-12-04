import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {VisitorAuthDto, VisitorAuthResponseDto, VisitorDto} from './visitor.model';

@Injectable({providedIn: 'root'})
export class VisitorService {

  private http = inject(HttpClient);
  private readonly visitorBaseUrl = `${environment.baseUrl}/visitor`;

  authenticate(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.http.post<VisitorAuthResponseDto>(this.visitorBaseUrl, authDto);
  }

  getMe(): Observable<VisitorDto> {
    return this.http.get<VisitorDto>(`${this.visitorBaseUrl}/me`);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.visitorBaseUrl}/${id}`);
  }

  verifyEmail(token: string): Observable<VisitorAuthResponseDto> {
    return this.http.get<VisitorAuthResponseDto>(`${this.visitorBaseUrl}/verify`, {
      params: {token},
      withCredentials: true
    });
  }

  unlockAchievement(code: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{
      success: boolean;
      message: string
    }>(`${this.visitorBaseUrl}/achievements/unlock/${code}`, {withCredentials: true});
  }

  updateEmail(email: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.visitorBaseUrl}/email`, {email});
  }

  updateAvatar(avatarSvg: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.visitorBaseUrl}/avatar`, {avatarSvg});
  }
}
