import {inject, Injectable, Signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {
  Achievement,
  AchievementCreate,
  AchievementStats,
  AchievementUnlockLog,
  UpdateAchievementDto
} from '../../core/state/achievement/achievement.model';
import {AchievementService} from '../../core/state/achievement/achievement.service';
import {AchievementStore} from '../../core/state/achievement/achievement.store';
import {AchievementLogsService} from './manage-achievements/state/achievement-logs/achievement-logs.service';
import {SkillCategory, SkillCreateDto, SkillDto} from '../skills/state/skill/skill.model';
import {SkillService} from '../skills/state/skill/skill.service';
import {SkillStore} from '../skills/state/skill/skill.store';
import {JobDto} from '../career/state/job/job.model';
import {JobService} from '../career/state/job/job.service';
import {EducationDto} from '../career/state/education/education.model';
import {EducationService} from '../career/state/education/education.service';
import {CertificationDto, CreateCertificationDto} from '../career/state/certification/certification.model';
import {CertificationService} from '../career/state/certification/certification.service';
import {
  ProjectDto,
  ProjectFilters,
  ProjectLightDto,
  ProjectMinimalResponseDto,
  UpdateProjectDto
} from '../projects/state/project/project.model';
import {ProjectService} from '../projects/state/project/project.service';
import {ProjectStore} from '../projects/state/project/project.store';
import {TimelineStore} from '../career/state/timeline/timeline.store';
import {
  EducationTimelineItem,
  JobTimelineItem,
  ProjectTimelineItem,
  TimelineItem,
  TimelineItemType
} from '../career/state/timeline/timeline.model';

@Injectable({providedIn: 'root'})
export class ConsoleFacade {

  private readonly achievementStore = inject(AchievementStore);
  private readonly achievementService = inject(AchievementService);
  private readonly achievementLogsService = inject(AchievementLogsService);

  private readonly skillStore = inject(SkillStore);
  private readonly skillService = inject(SkillService);

  private readonly jobService = inject(JobService);
  private readonly educationService = inject(EducationService);
  private readonly certificationService = inject(CertificationService);

  private readonly projectStore = inject(ProjectStore);
  private readonly projectService = inject(ProjectService);

  private readonly timelineStore = inject(TimelineStore);

  readonly achievements: Signal<Achievement[]> = this.achievementStore.achievements;
  readonly totalAchievements: Signal<number> = this.achievementStore.totalAchievements;
  readonly totalActiveAchievements: Signal<number> = this.achievementStore.totalActiveAchievements;
  readonly achievementStats: Signal<AchievementStats> = this.achievementStore.stats;
  readonly achievementsPage: Signal<number> = this.achievementStore.page;
  readonly achievementsTotalPages: Signal<number> = this.achievementStore.totalPages;
  readonly achievementsIsLoading: Signal<boolean> = this.achievementStore.isLoading;
  readonly achievementsStartIndex: Signal<number> = this.achievementStore.startIndex;
  readonly achievementsEndIndex: Signal<number> = this.achievementStore.endIndex;
  readonly achievementsTotal: Signal<number> = this.achievementStore.total;

  readonly skills: Signal<SkillDto[]> = this.skillStore.skills;

  readonly projects: Signal<ProjectLightDto[]> = this.projectStore.projects;
  readonly projectsTotal: Signal<number> = this.projectStore.total;
  readonly projectsPage: Signal<number> = this.projectStore.page;
  readonly projectsTotalPages: Signal<number> = this.projectStore.totalPages;
  readonly projectsIsLoading: Signal<boolean> = this.projectStore.isLoading;
  readonly projectsStartIndex: Signal<number> = this.projectStore.startIndex;
  readonly projectsEndIndex: Signal<number> = this.projectStore.endIndex;

  readonly timelineItems: Signal<TimelineItem[]> = this.timelineStore.items;
  readonly timelineLoading: Signal<boolean> = this.timelineStore.loading;
  readonly timelineError: Signal<string | null> = this.timelineStore.error;
  readonly timelineSelectedTypes: Signal<TimelineItemType[]> = this.timelineStore.selectedTypes;
  readonly timelineFilteredItems: Signal<TimelineItem[]> = this.timelineStore.filteredItems;
  readonly timelineHasItems: Signal<boolean> = this.timelineStore.hasItems;

  getAchievementLogs(): Observable<AchievementUnlockLog[]> {
    return this.achievementLogsService.findAll();
  }

  createAchievement(achievement: AchievementCreate): Observable<Achievement> {
    return this.achievementService.createAchievement(achievement).pipe(
      tap(achievement => this.achievementStore.addAchievement(achievement))
    );
  }

  updateAchievement(code: string, dto: UpdateAchievementDto): Observable<Achievement> {
    return this.achievementService.updateAchievement(code, dto).pipe(
      tap(achievement => this.achievementStore.updateAchievement(code, achievement))
    );
  }

  deleteAchievementByCode(code: string): Observable<void> {
    return this.achievementService.deleteAchievementByCode(code).pipe(
      tap(() => this.achievementStore.removeAchievementByCode(code))
    );
  }

  setAchievementsPage(page: number): void {
    this.achievementStore.setPage(page);
  }

  nextAchievementsPage(): void {
    this.achievementStore.nextPage();
  }

  previousAchievementsPage(): void {
    this.achievementStore.previousPage();
  }

  createSkill(skill: SkillCreateDto): Observable<SkillDto> {
    return this.skillService.createSkill(skill).pipe(
      tap(skill => this.skillStore.addSkill(skill))
    );
  }

  updateSkillCategory(id: string, category: SkillCategory): Observable<SkillDto> {
    return this.skillService.updateSkillCategory(id, category).pipe(
      tap(skill => this.skillStore.updateSkillCategory(id, skill.category))
    );
  }

  updateSkillLevel(id: string, level: number): Observable<SkillDto> {
    return this.skillService.updateSkillLevel(id, level).pipe(
      tap(skill => this.skillStore.updateSkillLevel(id, skill.level))
    );
  }

  removeSkillById(id: string): Observable<void> {
    return this.skillService.deleteSkillById(id).pipe(
      tap(() => this.skillStore.removeSkillById(id))
    );
  }

  addJob(jobFormData: FormData): Observable<JobDto> {
    return this.jobService.createJob(jobFormData).pipe(
      tap(job => this.timelineStore.addItem(this.mapJobToTimelineItem(job)))
    );
  }

  updateJob(id: string, jobFormData: FormData): Observable<JobDto> {
    return this.jobService.updateJob(id, jobFormData).pipe(
      tap(job => this.timelineStore.updateItem(this.mapJobToTimelineItem(job)))
    );
  }

  deleteJob(id: string): Observable<void> {
    return this.jobService.deleteJob(id).pipe(
      tap(() => this.timelineStore.deleteItem(id))
    );
  }

  addEducation(educationFormData: FormData): Observable<EducationDto> {
    return this.educationService.create(educationFormData).pipe(
      tap(education => this.timelineStore.addItem(this.mapEducationToTimelineItem(education)))
    );
  }

  updateEducation(id: string, educationFormData: FormData): Observable<EducationDto> {
    return this.educationService.update(id, educationFormData).pipe(
      tap(education => this.timelineStore.updateItem(this.mapEducationToTimelineItem(education)))
    );
  }

  deleteEducation(id: string): Observable<void> {
    return this.educationService.delete(id).pipe(
      tap(() => this.timelineStore.deleteItem(id))
    );
  }

  addCertification(dto: CreateCertificationDto): Observable<CertificationDto> {
    return this.certificationService.create(dto);
  }

  updateCertification(id: string, dto: Partial<CreateCertificationDto>): Observable<CertificationDto> {
    return this.certificationService.update(id, dto);
  }

  deleteCertification(id: string): Observable<void> {
    return this.certificationService.delete(id);
  }

  addProject(projectFormData: FormData): Observable<ProjectDto> {
    return this.projectService.createProject(projectFormData).pipe(
      tap(() => this.projectStore.loadProjects({}))
    );
  }

  updateProject(id: string, projectFormData: FormData): Observable<ProjectDto> {
    return this.projectService.updateProject(id, projectFormData).pipe(
      tap(() => this.projectStore.loadProjects({}))
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.projectService.deleteProject(id).pipe(
      tap(() => this.projectStore.loadProjects({}))
    );
  }

  loadProjects(options?: { page?: number; limit?: number; filters?: ProjectFilters }): void {
    this.projectStore.loadProjects(options || {});
  }

  setProjectsPage(page: number): void {
    this.projectStore.setPage(page);
  }

  nextProjectsPage(): void {
    this.projectStore.nextPage();
  }

  previousProjectsPage(): void {
    this.projectStore.previousPage();
  }

  getUnlinkedProjects(): Observable<ProjectMinimalResponseDto[]> {
    return this.projectService.getUnlinkedProjects();
  }

  linkProjectToTimeline(id: string, dto: UpdateProjectDto): Observable<ProjectDto> {
    return this.projectService.linkProjectToTimeline(id, dto).pipe(
      tap(project => this.timelineStore.addItem(this.mapProjectToTimelineItem(project)))
    );
  }

  detachProjectFromTimeline(id: string): Observable<ProjectDto> {
    return this.projectService.detachProjectFromTimeline(id).pipe(
      tap(() => this.timelineStore.deleteItem(id))
    );
  }

  refreshTimeline(): void {
    this.timelineStore.fetchTimeline();
  }

  setTimelineTypes(types: TimelineItemType[]): void {
    this.timelineStore.setSelectedTypes(types);
  }

  private mapJobToTimelineItem(job: JobDto): JobTimelineItem {
    return {
      id: job.id,
      type: TimelineItemType.Job,
      title: job.title,
      startDate: job.startDate ? job.startDate.toString() : null,
      endDate: job.endDate ? job.endDate.toString() : null,
      description: job.description || null,
      image: job.image || null,
      company: job.company,
      location: job.location || '',
      missions: job.missions || []
    };
  }

  private mapEducationToTimelineItem(education: EducationDto): EducationTimelineItem {
    return {
      id: education.id,
      type: TimelineItemType.Education,
      title: education.title,
      startDate: education.startDate ? education.startDate.toString() : null,
      endDate: education.endDate ? education.endDate.toString() : null,
      description: education.description || null,
      image: education.image || null,
      institution: education.institution,
      location: education.location,
      fieldOfStudy: education.fieldOfStudy || null,
      certifications: education.certifications?.map(cert => ({
        id: cert.id,
        title: cert.title,
        certificationType: cert.certificationType.toString()
      })) || []
    };
  }

  private mapProjectToTimelineItem(project: ProjectDto): ProjectTimelineItem {
    return {
      id: project.id,
      type: TimelineItemType.Project,
      title: project.title,
      startDate: project.startDate ? project.startDate.toString() : null,
      endDate: project.endDate ? project.endDate.toString() : null,
      description: project.description || null,
      image: project.image || null,
      projectTypes: project.projectTypes || [],
      scope: project.scope,
      market: project.market,
      skills: project.skills,
    };
  }
}
