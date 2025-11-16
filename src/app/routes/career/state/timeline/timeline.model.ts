import {SkillDto} from '../../../skills/state/skill/skill.model';

export interface TimelineItemDto {
  id: string;
  type: TimelineItemType;
  title: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  image?: string;
}

export enum TimelineItemType {
  Job = 'job',
  Education = 'education',
  Project = 'project',
  Milestone = 'milestone'
}

export interface TimelineItemBase {
  id: string;
  type: TimelineItemType;
  title: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  image: string | null;
}

export interface CertificationDto {
  id: string;
  title: string;
  certificationType: string;
}

export interface JobTimelineItem extends TimelineItemBase {
  type: TimelineItemType.Job;
  company: string;
  location: string;
  missions: string[];
}

export interface ProjectTimelineItem extends TimelineItemBase {
  type: TimelineItemType.Project;
  projectTypes: string[];
  scope: string;
  market: string;
  skills: SkillDto[];
}

export interface EducationTimelineItem extends TimelineItemBase {
  type: TimelineItemType.Education;
  institution: string;
  location: string;
  fieldOfStudy: string | null;
  certifications: CertificationDto[];
}

export interface MilestoneTimelineItem extends TimelineItemBase {
  type: TimelineItemType.Milestone;
}

export type TimelineItem =
  | JobTimelineItem
  | ProjectTimelineItem
  | EducationTimelineItem
  | MilestoneTimelineItem;

export interface TimelineItemTypeMeta {
  key: TimelineItemType;
  label: string;
  color: string;
  icon: string;
}

export const TIMELINE_ITEM_TYPE_META: Record<TimelineItemType, TimelineItemTypeMeta> = {
  [TimelineItemType.Job]: {
    key: TimelineItemType.Job,
    label: 'Expérience professionnelle',
    color: '#4A77B5',
    icon: 'work',
  },
  [TimelineItemType.Education]: {
    key: TimelineItemType.Education,
    label: 'Formation',
    color: '#399570',
    icon: 'school',
  },
  [TimelineItemType.Project]: {
    key: TimelineItemType.Project,
    label: 'Projet personnel',
    color: '#A47ABC',
    icon: 'lightbulb',
  },
  [TimelineItemType.Milestone]: {
    key: TimelineItemType.Milestone,
    label: 'Moment clé',
    color: '#C9A44A',
    icon: 'star',
  }
};
