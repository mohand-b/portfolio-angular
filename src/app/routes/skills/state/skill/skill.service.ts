import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {SkillCategory, SkillCreateDto, SkillDto} from './skill.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SkillService {

  private http = inject(HttpClient);
  private readonly skillBaseUrl = `${environment.baseUrl}/skills`;

  fetchSkills(): Observable<SkillDto[]> {
    return this.http.get<SkillDto[]>(`${this.skillBaseUrl}`, {withCredentials: true});
  }

  createSkill(skill: SkillCreateDto): Observable<SkillDto> {
    return this.http.post<SkillDto>(`${this.skillBaseUrl}`, skill, {withCredentials: true});
  }

  deleteSkillById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.skillBaseUrl}/${id}`, {withCredentials: true});
  }

  updateSkillCategory(id: string, category: SkillCategory): Observable<SkillDto> {
    return this.http.patch<SkillDto>(`${this.skillBaseUrl}/${id}/category`, {category}, {withCredentials: true});
  }

  updateSkillLevel(id: string, level: number): Observable<SkillDto> {
    return this.http.patch<SkillDto>(`${this.skillBaseUrl}/${id}/level`, {level}, {withCredentials: true});
  }
}
