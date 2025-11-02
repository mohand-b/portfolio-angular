import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {ProjectDto} from './project.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProjectService {

  private http = inject(HttpClient);
  private readonly projectBaseUrl = `${environment.baseUrl}/projects`;

  createProject(projectFormData: FormData): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.projectBaseUrl}/create`, projectFormData, {withCredentials: true});
  }

  getProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.projectBaseUrl}`);
  }

}
