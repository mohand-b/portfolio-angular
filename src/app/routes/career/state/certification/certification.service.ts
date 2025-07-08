import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environments';
import {CertificationDto} from './certification.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CertificationService {

  private http = inject(HttpClient);
  private readonly certificationBaseUrl = `${environment.baseUrl}/certifications`;

  createCertification(certificationFormData: FormData): Observable<CertificationDto> {
    return this.http.post<CertificationDto>(`${this.certificationBaseUrl}/create`, certificationFormData, {
      withCredentials: true
    });
  }
}
