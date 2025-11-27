import {VisitorDto} from '../../../../core/state/visitor/visitor.model';

export interface CreateQuestionDto {
  content: string;
  isAnonymous?: boolean;
}

export interface QuestionResponseDto {
  id: string;
  content: string;
  isAnonymous: boolean;
  status: QuestionStatusEnum;
  answer?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  visitor?: Pick<VisitorDto, 'firstName' | 'lastName' | 'email'>;
}

export interface QuestionPublicResponseDto {
  id: string;
  content: string;
  isAnonymous: boolean;
  status: QuestionStatusEnum;
  answer?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
}

export enum QuestionStatusEnum {
  PENDING = 'pending',
  ANSWERED = 'answered',
  REJECTED = 'rejected'
}
