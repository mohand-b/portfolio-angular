import {TimelineItemDto, TimelineItemType} from '../timeline/timeline.model';

export interface CertificationDto extends TimelineItemDto {
  type: TimelineItemType.Certification;
  school: string;
  location: string;
}

export interface CreateCertificationDto extends Omit<CertificationDto, 'id'> {
}
