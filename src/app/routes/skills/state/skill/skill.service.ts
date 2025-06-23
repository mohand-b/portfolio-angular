import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {SkillCreateDto, SkillDto} from './skill.model';
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
}
