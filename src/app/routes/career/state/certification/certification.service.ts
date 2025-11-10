import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {CertificationDto, CreateCertificationDto, UpdateCertificationDto} from './certification.model';

@Injectable({providedIn: 'root'})
export class CertificationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/certifications`;

  getAll(): Observable<CertificationDto[]> {
    return this.http.get<CertificationDto[]>(this.baseUrl, {
      withCredentials: true
    });
  }

  getById(id: string): Observable<CertificationDto> {
    return this.http.get<CertificationDto>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  create(dto: CreateCertificationDto): Observable<CertificationDto> {
    return this.http.post<CertificationDto>(`${this.baseUrl}/create`, dto, {
      withCredentials: true
    });
  }

  update(id: string, dto: UpdateCertificationDto): Observable<CertificationDto> {
    return this.http.patch<CertificationDto>(`${this.baseUrl}/${id}`, dto, {
      withCredentials: true
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}
