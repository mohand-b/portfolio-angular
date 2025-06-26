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
  Project = 'project',
  Certification = 'certification',
  Other = 'other'
}

interface TimelineItemTypeMeta {
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
  [TimelineItemType.Project]: {
    key: TimelineItemType.Project,
    label: 'Projets personnels',
    color: '#8e24aa',
    icon: 'lightbulb',
  },
  [TimelineItemType.Certification]: {
    key: TimelineItemType.Certification,
    label: 'Diplômes / Certifications',
    color: '#11bd89',
    icon: 'school',
  },
  [TimelineItemType.Other]: {
    key: TimelineItemType.Other,
    label: 'Autre',
    color: '#ecbd3a',
    icon: 'more_horiz',
  }
};
