import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {AdminAuthDto, AdminAuthResponseDto} from './admin.model';

@Injectable({providedIn: 'root'})
export class AdminService {

  private http = inject(HttpClient);
  private readonly adminBaseUrl = `${environment.baseUrl}/admin`;

  login(authDto: AdminAuthDto): Observable<AdminAuthResponseDto> {
    return this.http.post<AdminAuthResponseDto>(`${this.adminBaseUrl}/login`, authDto,
      {withCredentials: true}
    );
  }

  revokeToken(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.adminBaseUrl}/refresh-token`, {},
      {withCredentials: true}
    )
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.adminBaseUrl}/logout`, {},
      {withCredentials: true}
    );
  }

  checkSession(): Observable<any> {
    return this.http.get<any>(`${this.adminBaseUrl}/me`, {
      withCredentials: true
    });
  }
}
