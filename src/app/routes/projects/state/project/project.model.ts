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
  projectType: string;
  scope: string;
  market: string;
  challenges?: string;
  impact?: string;
  job?: JobDto;
  images?: string[];
  githubLink?: string;
}
