export interface Achievement {
  id: string;
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: Date;
}

export interface AchievementCreate {
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
}

export interface AchievementLight {
  code: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
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
