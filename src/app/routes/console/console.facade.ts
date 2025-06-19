import {inject, Injectable, Signal} from '@angular/core';
import {AchievementLogsService} from './state/achievement-logs/achievement-logs.service';
import {Observable, tap} from 'rxjs';
import {Achievement, AchievementCreate, AchievementUnlockLog} from '../../core/state/achievement/achievement.model';
import {AchievementService} from '../../core/state/achievement/achievement.service';
import {AchievementStore} from '../../core/state/achievement/achievement.store';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {


  private achievementLogsService = inject(AchievementLogsService);
  private achievementService = inject(AchievementService);
  private achievementStore = inject(AchievementStore);
  readonly achievements: Signal<Achievement[]> = this.achievementStore.entities;

  getAchievementLogs(): Observable<AchievementUnlockLog[]> {
    return this.achievementLogsService.findAll();
  }
  
  createAchievement(achievement: AchievementCreate): Observable<Achievement> {
    return this.achievementService.createAchievement(achievement).pipe(
      tap(achievement => {
        this.achievementStore.addAchievement(achievement)
      }),
    )
  }
}
