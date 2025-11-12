import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {JobDto, JobMinimalDto} from './job.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class JobService {

  private http = inject(HttpClient);
  private readonly jobBaseUrl = `${environment.baseUrl}/jobs`;

  createJob(jobFormData: FormData): Observable<JobDto> {
    return this.http.post<JobDto>(`${this.jobBaseUrl}/create`, jobFormData, {withCredentials: true});
  }

  getJobs(): Observable<JobDto[]> {
    return this.http.get<JobDto[]>(`${this.jobBaseUrl}`);
  }

  getJobsMinimal(): Observable<JobMinimalDto[]> {
    return this.http.get<JobMinimalDto[]>(`${this.jobBaseUrl}/minimal`);
  }

}
