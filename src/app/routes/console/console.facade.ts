import {inject, Injectable, Signal} from '@angular/core';
import {AchievementLogsService} from './state/achievement-logs/achievement-logs.service';
import {Observable, tap} from 'rxjs';
import {
  Achievement,
  AchievementCreate,
  AchievementLight,
  AchievementUnlockLog
} from '../../core/state/achievement/achievement.model';
import {AchievementService} from '../../core/state/achievement/achievement.service';
import {AchievementStore} from '../../core/state/achievement/achievement.store';
import {SkillStore} from '../skills/state/skill/skill.store';
import {SkillCreateDto, SkillDto} from '../skills/state/skill/skill.model';
import {SkillService} from '../skills/state/skill/skill.service';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {


  private achievementLogsService = inject(AchievementLogsService);
  private achievementService = inject(AchievementService);
  private skillService = inject(SkillService);
  private achievementStore = inject(AchievementStore);
  readonly achievements: Signal<AchievementLight[]> = this.achievementStore.achievements;
  private skillStore = inject(SkillStore);
  readonly skills: Signal<SkillDto[]> = this.skillStore.skills;

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

  deleteAchievementByCode(code: string): Observable<void> {
    return this.achievementService.deleteAchievementByCode(code).pipe(
      tap(() => {
        this.achievementStore.removeAchievementByCode(code);
      }),
    );
  }

  createSkill(skill: SkillCreateDto): Observable<SkillDto> {
    return this.skillService.createSkill(skill).pipe(
      tap((skill: SkillDto) => {
        this.skillStore.addSkill(skill);
      }),
    );
  }

}
