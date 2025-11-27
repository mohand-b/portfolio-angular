export interface ContactMessageDto {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponseDto {
  message: string;
}
