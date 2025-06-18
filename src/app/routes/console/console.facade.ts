import {inject, Injectable} from '@angular/core';
import {AchievementLogsService} from './state/achievement-logs/achievement-logs.service';
import {Observable} from 'rxjs';
import {AchievementUnlockLog} from '../../core/state/achievement/achievement.model';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {

  private achievementLogsService = inject(AchievementLogsService);

  getAchievementLogs(): Observable<AchievementUnlockLog[]> {
    return this.achievementLogsService.findAll();
  }
}
