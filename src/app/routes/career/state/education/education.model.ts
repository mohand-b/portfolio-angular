import {TimelineItemDto, TimelineItemType} from '../timeline/timeline.model';

export interface EducationDto extends TimelineItemDto {
  type: TimelineItemType.Education;
  institution: string;
  location: string;
  fieldOfStudy?: string;
  certifications?: CertificationDto[];
}

export interface CertificationInputDto {
  title: string;
  certificationType: CertificationType;
}

export interface CreateEducationDto {
  title: string;
  institution: string;
  location: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  image?: File;
  certifications?: CertificationInputDto[];
}

export interface UpdateEducationDto {
  title?: string;
  institution?: string;
  location?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  image?: File;
}

export interface CertificationDto {
  id: string;
  title: string;
  certificationType: CertificationType;
  educationId: string;
}

export enum CertificationType {
  Academic = 'academic',
  Professional = 'professional',
  Habilitation = 'habilitation'
}

export const CERTIFICATION_TYPE_META: Record<CertificationType, { label: string; icon: string }> = {
  [CertificationType.Academic]: {
    label: 'Diplôme académique',
    icon: 'school'
  },
  [CertificationType.Professional]: {
    label: 'Certification professionnelle',
    icon: 'workspace_premium'
  },
  [CertificationType.Habilitation]: {
    label: 'Habilitation',
    icon: 'verified'
  }
};

export interface CreateCertificationDto {
  title: string;
  certificationType: CertificationType;
  educationId: string;
}

export interface UpdateCertificationDto {
  title?: string;
  certificationType?: CertificationType;
}
