import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {MilestoneDto} from './milestone.model';

@Injectable({providedIn: 'root'})
export class MilestoneService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/milestones`;

  create(formData: FormData): Observable<MilestoneDto> {
    return this.http.post<MilestoneDto>(`${this.baseUrl}/create`, formData, {withCredentials: true});
  }

  update(id: string, formData: FormData): Observable<MilestoneDto> {
    return this.http.patch<MilestoneDto>(`${this.baseUrl}/${id}`, formData, {withCredentials: true});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {withCredentials: true});
  }
}
