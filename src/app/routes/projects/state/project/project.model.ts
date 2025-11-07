import {JobDto} from '../../../career/state/job/job.model';
import {TimelineItemDto, TimelineItemType} from '../../../career/state/timeline/timeline.model';
import {SkillDto} from '../../../skills/state/skill/skill.model';

export interface ProjectDto extends TimelineItemDto {
  type: TimelineItemType.Project;
  context: string;
  collaboration?: string;
  missions: string[];
  tools: string[];
  skills: SkillDto[];
  projectTypes: string[];
  scope: string;
  market: string;
  challenges?: string;
  impact?: string;
  job?: JobDto;
  images?: string[];
  githubLink?: string;
}

export interface CreateProjectDto extends Omit<ProjectDto, 'id'> {
}

export interface UpdateProjectDto {
  startDate: Date;
  endDate?: Date;
}

export interface PaginatedProjectsResponseDto {
  data: ProjectDto[];
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
