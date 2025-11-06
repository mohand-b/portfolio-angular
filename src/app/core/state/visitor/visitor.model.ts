export interface Visitor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpiresAt?: Date;
  avatarSvg: string;
  createdAt: Date;
  lastVisitAt: Date;
}

export interface VisitorDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  lastVisitAt: string;
  avatarSvg: string | null;
  achievements?: {
    unlocked: number;
    total: number;
    percentCompletion: number;
  };
}

export interface PaginatedVisitorsResponse {
  data: VisitorDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VisitorAuthDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface VisitorAuthResponseDto extends Visitor {
  accessToken: string;
}

export interface VisitorStats {
  totalVisitors: number;
  verifiedVisitors: number;
  visitorsToday: number;
  engagedVisitors: number;
}

