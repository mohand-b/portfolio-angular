import {TimelineItemDto, TimelineItemType} from '../timeline/timeline.model';
import {ProjectDto} from '../../../projects/state/project/project.model';

export interface JobDto extends TimelineItemDto {
  type: TimelineItemType.Job;
  company: string;
  location?: string;
  missions: string[];
  projects?: ProjectDto[];
}

export interface JobMinimalDto {
  id: string;
  company: string;
  logo: string | null;
}

export interface CreateJobDto extends Omit<JobDto, 'id' | 'createdAt' | 'projects'> {
}

export interface UpdateJobDto extends Partial<Omit<JobDto, 'id' | 'type' | 'createdAt' | 'projects'>> {
}
