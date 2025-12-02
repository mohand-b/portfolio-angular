export interface MilestoneDto {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  image: string | null;
}

export interface CreateMilestoneDto extends Omit<MilestoneDto, 'id'> {
}

export interface UpdateMilestoneDto extends Partial<Omit<MilestoneDto, 'id'>> {
}
