export interface MilestoneDto {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  image: string | null;
}
