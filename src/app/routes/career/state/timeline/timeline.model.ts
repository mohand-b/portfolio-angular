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
    color: '#58acff',
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
    color: '#f465f1',
    icon: 'lightbulb',
  },
  [TimelineItemType.Other]: {
    key: TimelineItemType.Other,
    label: 'Autre',
    color: '#ecbd3a',
    icon: 'more_horiz',
  }
};
