import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {PaginatedProjectsResponseDto, ProjectDto, ProjectFilters, ProjectMinimalResponseDto, UpdateProjectDto} from './project.model';

@Injectable({providedIn: 'root'})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/projects`;

  createProject(projectFormData: FormData): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.baseUrl}/create`, projectFormData, {withCredentials: true});
  }

  getProjects(page = 1, limit = 10, filters?: ProjectFilters): Observable<PaginatedProjectsResponseDto> {
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

    return this.http.get<PaginatedProjectsResponseDto>(`${this.baseUrl}/list`, {params});
  }

  getProjectById(id: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.baseUrl}/${id}`, {withCredentials: true});
  }

  updateProject(id: string, projectFormData: FormData): Observable<ProjectDto> {
    return this.http.patch<ProjectDto>(`${this.baseUrl}/${id}`, projectFormData, {withCredentials: true});
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {withCredentials: true});
  }

  getUnlinkedProjects(): Observable<ProjectMinimalResponseDto[]> {
    return this.http.get<ProjectMinimalResponseDto[]>(`${this.baseUrl}/unlinked`, {withCredentials: true});
  }

  linkProjectToTimeline(id: string, dto: UpdateProjectDto): Observable<ProjectDto> {
    return this.http.patch<ProjectDto>(`${this.baseUrl}/${id}`, dto, {withCredentials: true});
  }
}
