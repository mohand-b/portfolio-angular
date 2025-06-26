export interface TimelineItemDto {
  id: string;
  type: TimelineItemType;
  title: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
}

export enum TimelineItemType {
  Job = 'job',
  Certification = 'certification',
  Project = 'project',
  Other = 'other'
}

export interface TimelineItemTypeMeta {
  key: TimelineItemType;
  label: string;
  color: string;
  icon: string;
}

export const TIMELINE_ITEM_TYPE_META: Record<TimelineItemType, TimelineItemTypeMeta> = {
  [TimelineItemType.Job]: {
    key: TimelineItemType.Job,
    label: 'Expériences professionnelles',
    color: '#1976D2',
    icon: 'work',
  },
  [TimelineItemType.Certification]: {
    key: TimelineItemType.Certification,
    label: 'Diplômes / Certifications',
    color: '#11bd89',
    icon: 'school',
  },
  [TimelineItemType.Project]: {
    key: TimelineItemType.Project,
    label: 'Projets personnels',
    color: '#8e24aa',
    icon: 'lightbulb',
  },
  [TimelineItemType.Other]: {
    key: TimelineItemType.Other,
    label: 'Autre',
    color: '#ecbd3a',
    icon: 'more_horiz',
  }
};
