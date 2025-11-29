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
  visitor?: Pick<VisitorDto, 'id' | 'username' | 'avatarSvg'>
}

export interface PaginatedQuestionsResponseDto {
  data: QuestionResponseDto[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export enum QuestionStatusEnum {
  PENDING = 'pending',
  ANSWERED = 'answered',
  REJECTED = 'rejected'
}

export interface AnswerQuestionDto {
  answer: string;
}

export interface RejectQuestionDto {
  rejectionReason: string;
}

export interface QuestionStatsResponseDto {
  pending: number;
  answered: number;
  rejected: number;
  total: number;
}
