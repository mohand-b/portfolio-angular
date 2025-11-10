import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {EducationDto} from './education.model';

@Injectable({providedIn: 'root'})
export class EducationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/education`;

  getAll(): Observable<EducationDto[]> {
    return this.http.get<EducationDto[]>(this.baseUrl, {
      withCredentials: true
    });
  }

  getById(id: string): Observable<EducationDto> {
    return this.http.get<EducationDto>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  create(educationFormData: FormData): Observable<EducationDto> {
    return this.http.post<EducationDto>(`${this.baseUrl}/create`, educationFormData, {
      withCredentials: true
    });
  }

  update(id: string, educationFormData: FormData): Observable<EducationDto> {
    return this.http.patch<EducationDto>(`${this.baseUrl}/${id}`, educationFormData, {
      withCredentials: true
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}
