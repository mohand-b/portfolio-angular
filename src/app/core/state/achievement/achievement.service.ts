import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Achievement, AchievementCreate} from './achievement.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AchievementService {

  private http = inject(HttpClient);
  private readonly achievementBaseUrl = `${environment.baseUrl}/achievements`;

  fetchAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.achievementBaseUrl}`, {withCredentials: true});
  }

  createAchievement(achievement: AchievementCreate): Observable<Achievement> {
    return this.http.post<Achievement>(`${this.achievementBaseUrl}`, achievement, {withCredentials: true});
  }
}
