export interface Achievement {
  id: string;
  code: string;
  label: string;
  description?: string;
  createdAt: Date;
}

export interface AchievementCreate {
  code: string;
  label: string;
  description?: string;
}

export interface AchievementLight {
  code: string;
  label: string;
  description?: string;
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
