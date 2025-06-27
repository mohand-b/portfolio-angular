import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {JobCreateDto, JobDto} from './job.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class JobService {

  private http = inject(HttpClient);
  private readonly jobBaseUrl = `${environment.baseUrl}/jobs`;

  createJob(job: JobCreateDto): Observable<JobDto> {
    return this.http.post<JobDto>(`${this.jobBaseUrl}/create`, job, {withCredentials: true});
  }

  getJobs(): Observable<JobDto[]> {
    return this.http.get<JobDto[]>(`${this.jobBaseUrl}`);
  }

}
