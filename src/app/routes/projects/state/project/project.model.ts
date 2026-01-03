import {JobDto} from '../../../career/state/job/job.model';
import {TimelineItemDto, TimelineItemType} from '../../../career/state/timeline/timeline.model';
import {SkillDto} from '../../../skills/state/skill/skill.model';

export enum ProjectStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DRAFT = 'DRAFT',
}

export enum ProjectScope {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  PERSONAL = 'PERSONAL',
}

export enum ProjectMarket {
  B2B = 'B2B',
  B2C = 'B2C',
}

export enum TeamRole {
  FULL_STACK_DEVELOPER = 'FULL_STACK_DEVELOPER',
  FRONTEND_DEVELOPER = 'FRONTEND_DEVELOPER',
  BACKEND_DEVELOPER = 'BACKEND_DEVELOPER',
  DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
  PRODUCT_OWNER = 'PRODUCT_OWNER',
  PRODUCT_PROXY_OWNER = 'PRODUCT_PROXY_OWNER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  WEB_DESIGNER = 'WEB_DESIGNER',
  TECH_LEAD = 'TECH_LEAD',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.IN_PROGRESS]: 'En cours',
  [ProjectStatus.DONE]: 'Terminé',
  [ProjectStatus.ARCHIVED]: 'Archivé',
};

export const PROJECT_VISIBILITY_LABELS: Record<ProjectVisibility, string> = {
  [ProjectVisibility.PUBLIC]: 'Public',
  [ProjectVisibility.PRIVATE]: 'Privé',
  [ProjectVisibility.DRAFT]: 'Brouillon',
};

export const PROJECT_SCOPE_LABELS: Record<ProjectScope, string> = {
  [ProjectScope.INTERNAL]: 'Interne',
  [ProjectScope.EXTERNAL]: 'Externe',
  [ProjectScope.PERSONAL]: 'Personnel',
};

export const PROJECT_MARKET_LABELS: Record<ProjectMarket, string> = {
  [ProjectMarket.B2B]: 'B2B',
  [ProjectMarket.B2C]: 'B2C',
};

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  [TeamRole.FULL_STACK_DEVELOPER]: 'Développeur Full Stack',
  [TeamRole.FRONTEND_DEVELOPER]: 'Développeur Frontend',
  [TeamRole.BACKEND_DEVELOPER]: 'Développeur Backend',
  [TeamRole.DEVOPS_ENGINEER]: 'Ingénieur DevOps',
  [TeamRole.PRODUCT_OWNER]: 'Product Owner',
  [TeamRole.PRODUCT_PROXY_OWNER]: 'Product Proxy Owner',
  [TeamRole.PROJECT_MANAGER]: 'Chef de projet',
  [TeamRole.WEB_DESIGNER]: 'Web Designer',
  [TeamRole.TECH_LEAD]: 'Tech Lead',
};

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

export interface ProjectMediaDto {
  id: string;
  url: string;
  name: string;
  alt?: string;
  isCover: boolean;
}

export interface ProjectDto extends TimelineItemDto {
  type: TimelineItemType.Project;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  companyProject: boolean;
  organizationName?: string;
  roleTitle?: string;
  teamSize?: number;
  teamComposition?: TeamRole[];
  scope?: ProjectScope;
  market?: ProjectMarket;
  projectTypes: string[];
  domains?: string[];
  context?: string;
  problem?: string;
  solution?: string;
  achievements?: string[];
  challenges?: string[];
  skills: SkillDto[];
  job?: JobDto;
  media: ProjectMediaDto[];
}

export interface ProjectLightDto extends Pick<TimelineItemDto, 'id' | 'title' | 'description'>,
  Partial<Pick<ProjectDto, 'projectTypes' | 'scope' | 'market' | 'status'>> {
  job?: Pick<JobDto, 'id' | 'title' | 'company'> | null;
  coverImage?: string;
  companyProject?: boolean;
  organizationName?: string;
}

export interface ProjectMinimalResponseDto {
  id: string;
  title: string;
}

export interface MediaMetadata {
  name?: string;
  alt?: string;
  isCover?: boolean;
}

export interface CreateProjectDto {
  title: string;
  projectTypes: string[];
  description?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  companyProject?: boolean;
  organizationName?: string;
  roleTitle?: string;
  teamSize?: number;
  teamComposition?: TeamRole[];
  scope?: ProjectScope;
  market?: ProjectMarket;
  domains?: string[];
  context?: string;
  problem?: string;
  solution?: string;
  achievements?: string[];
  challenges?: string[];
  skillIds?: string[];
  jobId?: string;
  mediaMetadata?: MediaMetadata[];
  files?: File[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  startDate?: Date;
  endDate?: Date;
  isLinkedToJob?: boolean;
  removeAllMedia?: boolean;
  fieldsToDelete?: string[];
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
