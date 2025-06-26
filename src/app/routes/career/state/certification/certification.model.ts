import {TimelineItemDto, TimelineItemType} from '../timeline/timeline.model';

export interface CertificationDto extends TimelineItemDto {
  type: TimelineItemType.Certification;
  school: string;
  location: string;
}
