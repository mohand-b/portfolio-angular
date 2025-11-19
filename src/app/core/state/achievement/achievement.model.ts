export interface Achievement {
  id: string;
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  unlockedCount: number;
}

export interface AchievementCreate {
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface UpdateAchievementDto {
  label: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface AchievementUnlockLog {
  id: string;
  unlockedAt: Date;
  visitorId: string;
  visitorName?: string;
  achievementId: string;
  achievementCode: string;
  achievementLabel: string;
}

export interface AchievementStats {
  totalUnlocked: number;
  completionRate: number;
}

export interface PaginatedAchievementsResponse {
  data: Achievement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AchievementDto {
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
}
