import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environments';
import {TimelineItem, TimelineItemType} from './timeline.model';

@Injectable({providedIn: 'root'})
export class TimelineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/timeline`;

  getTimeline(types?: TimelineItemType[]): Observable<TimelineItem[]> {
    const params = types?.length
      ? types.reduce((acc, type) => acc.append('types', type), new HttpParams())
      : new HttpParams();

    return this.http.get<TimelineItem[]>(this.apiUrl, {params});
  }
}
