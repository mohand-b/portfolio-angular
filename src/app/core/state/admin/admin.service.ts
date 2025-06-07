import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {AdminAuthDto, AdminAuthResponseDto} from './admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private http = inject(HttpClient);
  private readonly adminBaseUrl = `${environment.baseUrl}/admin`;

  login(authDto: AdminAuthDto): Observable<AdminAuthResponseDto>{
    return this.http.post<AdminAuthResponseDto>(`${this.adminBaseUrl}/login`, authDto);
  }
}
