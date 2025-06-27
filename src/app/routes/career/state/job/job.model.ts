import {TimelineItemDto, TimelineItemType} from '../timeline/timeline.model';
import {ProjectDto} from '../../../projects/state/project/project.model';

export interface JobDto extends TimelineItemDto {
  type: TimelineItemType.Job;
  company: string;
  location?: string;
  missions: string[];
  projects?: ProjectDto[];
}

export interface JobCreateDto extends JobDto {
}
