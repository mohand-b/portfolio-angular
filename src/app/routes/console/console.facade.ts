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
import {SkillCategory, SkillCreateDto, SkillDto} from '../skills/state/skill/skill.model';
import {SkillService} from '../skills/state/skill/skill.service';
import {JobService} from '../career/state/job/job.service';
import {JobCreateDto, JobDto} from '../career/state/job/job.model';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {


  private achievementLogsService = inject(AchievementLogsService);
  private achievementService = inject(AchievementService);
  private jobService = inject(JobService);
  private skillService = inject(SkillService);
  private achievementStore = inject(AchievementStore);
  readonly achievements: Signal<AchievementLight[]> = this.achievementStore.achievements;
  private skillStore = inject(SkillStore);
  readonly skills: Signal<SkillDto[]> = this.skillStore.skills;

  // ACHIEVEMENTS

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

  // SKILLS

  createSkill(skill: SkillCreateDto): Observable<SkillDto> {
    return this.skillService.createSkill(skill).pipe(
      tap((skill: SkillDto) => {
        this.skillStore.addSkill(skill);
      }),
    );
  }

  updateSkillCategory(id: string, category: SkillCategory): Observable<SkillDto> {
    return this.skillService.updateSkillCategory(id, category).pipe(
      tap((skill: SkillDto) => {
        this.skillStore.updateSkillCategory(id, skill.category);
      }),
    );
  }

  updateSkillLevel(id: string, level: number): Observable<SkillDto> {
    return this.skillService.updateSkillLevel(id, level).pipe(
      tap((skill: SkillDto) => {
        this.skillStore.updateSkillLevel(id, skill.level);
      }),
    );
  }

  removeSkillById(id: string): Observable<void> {
    return this.skillService.deleteSkillById(id).pipe(
      tap(() => {
        this.skillStore.removeSkillById(id);
      })
    );
  }

  // JOBS

  addJob(job: JobCreateDto): Observable<JobDto> {
    return this.jobService.createJob(job)
  }

}
