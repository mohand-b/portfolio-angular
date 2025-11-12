import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environments';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Achievement, AchievementCreate, AchievementStats, UpdateAchievementDto, PaginatedAchievementsResponse} from './achievement.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AchievementService {

  private http = inject(HttpClient);
  private readonly achievementBaseUrl = `${environment.baseUrl}/achievements`;

  fetchAchievements(): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.achievementBaseUrl}`, {withCredentials: true});
  }

  fetchPaginatedAchievements(page: number, limit: number): Observable<PaginatedAchievementsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedAchievementsResponse>(`${this.achievementBaseUrl}/list`, {params, withCredentials: true});
  }

  fetchAchievementStats(): Observable<AchievementStats> {
    return this.http.get<AchievementStats>(`${this.achievementBaseUrl}/stats`, {withCredentials: true});
  }

  createAchievement(achievement: AchievementCreate): Observable<Achievement> {
    return this.http.post<Achievement>(`${this.achievementBaseUrl}`, achievement, {withCredentials: true});
  }

  updateAchievement(code: string, dto: UpdateAchievementDto): Observable<Achievement> {
    return this.http.patch<Achievement>(`${this.achievementBaseUrl}/code/${code}`, dto, {withCredentials: true});
  }

  deleteAchievementByCode(code: string): Observable<void> {
    return this.http.delete<void>(`${this.achievementBaseUrl}/code/${code}`, {withCredentials: true});
  }
}
