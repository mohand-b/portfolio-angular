export interface Visitor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpiresAt?: Date;
  createdAt: Date;
  lastVisitAt: Date;
}

export interface VisitorAuthDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface VisitorAuthResponseDto extends Visitor {
  accessToken: string;
}
