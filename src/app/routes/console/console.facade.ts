import {inject, Injectable, Signal} from '@angular/core';
import {AchievementLogsService} from './manage-achievements/state/achievement-logs/achievement-logs.service';
import {Observable, tap} from 'rxjs';
import {Achievement, AchievementCreate, AchievementStats, AchievementUnlockLog} from '../../core/state/achievement/achievement.model';
import {AchievementService} from '../../core/state/achievement/achievement.service';
import {AchievementStore} from '../../core/state/achievement/achievement.store';
import {SkillStore} from '../skills/state/skill/skill.store';
import {SkillCategory, SkillCreateDto, SkillDto} from '../skills/state/skill/skill.model';
import {SkillService} from '../skills/state/skill/skill.service';
import {JobService} from '../career/state/job/job.service';
import {JobDto} from '../career/state/job/job.model';
import {CertificationDto} from '../career/state/certification/certification.model';
import {CertificationService} from '../career/state/certification/certification.service';
import {ProjectService} from '../projects/state/project/project.service';
import {ProjectDto} from '../projects/state/project/project.model';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {


  private achievementLogsService = inject(AchievementLogsService);
  private achievementService = inject(AchievementService);
  private jobService = inject(JobService);
  private skillService = inject(SkillService);
  private certificationService = inject(CertificationService);
  private projectService = inject(ProjectService);
  private achievementStore = inject(AchievementStore);
  readonly achievements: Signal<Achievement[]> = this.achievementStore.achievements;
  readonly totalAchievements: Signal<number> = this.achievementStore.totalAchievements;
  readonly totalActiveAchievements: Signal<number> = this.achievementStore.totalActiveAchievements;
  readonly achievementStats: Signal<AchievementStats> = this.achievementStore.stats;

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

  addJob(jobFormData: FormData): Observable<JobDto> {
    return this.jobService.createJob(jobFormData)
  }

  // CERTIFICATIONS

  addCertification(certificationFormData: FormData): Observable<CertificationDto> {
    return this.certificationService.createCertification(certificationFormData);
  }

  // PROJECTS

  addProject(projectFormData: FormData): Observable<ProjectDto> {
    return this.projectService.createProject(projectFormData);
  }

  getProjects(): Observable<ProjectDto[]> {
    return this.projectService.getProjects();
  }

}
