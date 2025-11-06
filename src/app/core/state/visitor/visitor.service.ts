import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environments';
import {Observable} from 'rxjs';
import {PaginatedVisitorsResponse, VisitorAuthDto, VisitorAuthResponseDto} from './visitor.model';

@Injectable({ providedIn: 'root' })
export class VisitorService {

  private http = inject(HttpClient);
  private readonly visitorBaseUrl = `${environment.baseUrl}/visitor`;

  authenticate(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.http.post<VisitorAuthResponseDto>(this.visitorBaseUrl, authDto);
  }

  getAllPaginated(page: number, limit: number = 5): Observable<PaginatedVisitorsResponse> {
    return this.http.get<PaginatedVisitorsResponse>(`${this.visitorBaseUrl}/all`, {
      params: { page: page.toString(), limit: limit.toString() },
      withCredentials: true
    });
  }
}
