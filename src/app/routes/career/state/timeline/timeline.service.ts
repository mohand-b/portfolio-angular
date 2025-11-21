import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {TimelineItem, TimelineItemType} from './timeline.model';

interface TimelineResponse {
  data: TimelineItem[];
}

@Injectable({providedIn: 'root'})
export class TimelineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/timeline`;

  getTimeline(types?: TimelineItemType[]): Observable<TimelineItem[]> {
    const params = types?.length
      ? types.reduce((acc, type) => acc.append('types', type), new HttpParams())
      : new HttpParams();

    return this.http.get<TimelineResponse>(this.apiUrl, {params}).pipe(
      map(response => response.data)
    );
  }
}
