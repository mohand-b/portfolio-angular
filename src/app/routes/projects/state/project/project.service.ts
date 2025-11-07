import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {ProjectDto, PaginatedProjectsResponseDto, ProjectFilters} from './project.model';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private http = inject(HttpClient);
  private readonly projectBaseUrl = `${environment.baseUrl}/projects`;

  createProject(projectFormData: FormData): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.projectBaseUrl}/create`, projectFormData, {withCredentials: true});
  }

  getProjects(page: number = 1, limit: number = 10, filters?: ProjectFilters): Observable<PaginatedProjectsResponseDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.title) {
      params = params.set('title', filters.title);
    }
    if (filters?.projectTypes?.length) {
      params = params.set('projectTypes', filters.projectTypes.join(','));
    }
    if (filters?.skillIds?.length) {
      params = params.set('skillIds', filters.skillIds.join(','));
    }
    if (filters?.isPersonal !== undefined) {
      params = params.set('isPersonal', filters.isPersonal.toString());
    }

    return this.http.get<PaginatedProjectsResponseDto>(`${this.projectBaseUrl}/list`, {params});
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.projectBaseUrl}/${id}`, {withCredentials: true});
  }
}
