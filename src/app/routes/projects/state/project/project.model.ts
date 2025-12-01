import {JobDto} from '../../../career/state/job/job.model';
import {TimelineItemDto, TimelineItemType} from '../../../career/state/timeline/timeline.model';
import {SkillDto} from '../../../skills/state/skill/skill.model';

export type ProjectScope = 'Interne' | 'Externe';
export type ProjectMarket = 'B2B' | 'B2C' | 'C2C' | 'Communautaire';

export const PROJECT_TYPE_OPTIONS = [
  'SaaS',
  'Dashboard',
  'Web App',
  'Mobile-like',
  'Back-office',
  'Site vitrine',
  'Réseau social',
  'Tool',
] as const;

export type ProjectType = typeof PROJECT_TYPE_OPTIONS[number];

export interface ProjectDto extends TimelineItemDto {
  type: TimelineItemType.Project;
  collaboration?: string;
  missions: string[];
  tools: string[];
  skills: SkillDto[];
  projectTypes: string[];
  scope?: ProjectScope;
  market?: ProjectMarket;
  challenges?: string;
  impact?: string;
  job?: JobDto;
  images?: string[];
  githubLink?: string;
}

export interface ProjectLightDto extends Pick<TimelineItemDto, 'id' | 'title' | 'description'>,
  Partial<Pick<ProjectDto, 'projectTypes' | 'scope' | 'market'>> {
  job?: Pick<JobDto, 'id' | 'title' | 'company'> | null;
}

export interface ProjectMinimalResponseDto {
  id: string;
  title: string;
}

export interface CreateProjectDto extends Omit<ProjectDto, 'id'> {
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  collaboration?: string;
  missions?: string[];
  projectTypes?: string[];
  scope?: ProjectScope;
  market?: ProjectMarket;
  challenges?: string;
  impact?: string;
  skillIds?: string[];
  jobId?: string | null;
  startDate?: Date;
  endDate?: Date;
  githubLink?: string;
}

export interface PaginatedProjectsResponseDto {
  data: ProjectLightDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectFilters {
  title?: string;
  projectTypes?: string[];
  skillIds?: string[];
  isPersonal?: boolean;
}
