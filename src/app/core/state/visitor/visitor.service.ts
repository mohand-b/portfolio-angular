import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {VisitorAuthDto, VisitorAuthResponseDto} from './visitor.model';

@Injectable({providedIn: 'root'})
export class VisitorService {

  private http = inject(HttpClient);
  private readonly visitorBaseUrl = `${environment.baseUrl}/visitor`;

  authenticate(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.http.post<VisitorAuthResponseDto>(this.visitorBaseUrl, authDto);
  }

}
