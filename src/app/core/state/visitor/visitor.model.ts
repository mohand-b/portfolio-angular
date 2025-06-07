export interface Visitor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export interface VisitorAuthDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface VisitorAuthResponseDto extends Visitor {
  accessToken: string;
}
