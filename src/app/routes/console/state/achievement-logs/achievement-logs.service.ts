import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {AchievementUnlockLog} from '../../../../core/state/achievement/achievement.model';

@Injectable({providedIn: 'root'})
export class AchievementLogsService {

  private http = inject(HttpClient);
  private readonly achievementLogsUrl = `${environment.baseUrl}/admin/achievement-unlock-logs`;

  findAll() {
    return this.http.get<AchievementUnlockLog[]>(this.achievementLogsUrl,
      {withCredentials: true}
    );
  }
}
