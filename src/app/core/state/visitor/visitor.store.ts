import {computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {calculateAchievementPercentage, Visitor} from './visitor.model';
import {AchievementDto, UnlockedAchievementDto, VisitorAchievementsResponseDto} from '../achievement/achievement.model';

interface VisitorState {
  visitor: Visitor | null;
  achievementsUnlock: VisitorAchievementsResponseDto | null;
}

export const VisitorStore = signalStore(
  {providedIn: 'root'},
  withState<VisitorState>({visitor: null, achievementsUnlock: null}),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.visitor()),
    isVerified: computed(() => store.visitor()?.isVerified || false),
    fullName: computed(() => {
      const visitor = store.visitor();
      return visitor ? `${visitor.firstName} ${visitor.lastName}` : null;
    }),
    achievements: computed(() => store.visitor()?.achievements || null),
    percentCompletion: computed(() => store.visitor()?.achievements?.percentCompletion || 0),
    verificationMessage: computed(() => store.visitor()?.message || null),
    achievementsUnlockSorted: computed(() => {
      const achievements = store.achievementsUnlock();
      if (!achievements) return null;

      const sortedUnlocked = [...achievements.unlocked]
        .sort((a, b) => new Date(a.unlockedAt).getTime() - new Date(b.unlockedAt).getTime());

      return {
        unlocked: sortedUnlocked,
        locked: achievements.locked
      };
    }),
  })),
  withMethods((store) => ({
    setVisitor(visitor: Visitor | null) {
      patchState(store, {visitor});
    },
    setAchievementsUnlock(achievementsUnlock: VisitorAchievementsResponseDto | null) {
      patchState(store, {achievementsUnlock});
    },
    incrementAchievements(count: number) {
      const currentVisitor = store.visitor();

      if (!currentVisitor?.achievements) return;

      const {total} = currentVisitor.achievements;
      const unlocked = currentVisitor.achievements.unlocked + count;
      const percentCompletion = calculateAchievementPercentage(unlocked, total);

      patchState(store, {
        visitor: {
          ...currentVisitor,
          achievements: {unlocked, total, percentCompletion}
        }
      });
    },
    setVerified() {
      const currentVisitor = store.visitor();

      if (!currentVisitor) return;

      patchState(store, {
        visitor: {
          ...currentVisitor,
          isVerified: true
        }
      });
    },
    clear() {
      patchState(store, {visitor: null, achievementsUnlock: null});
    },
    addUnlockedAchievement(achievement: AchievementDto) {
      const currentAchievements = store.achievementsUnlock();
      if (!currentAchievements) return;

      const alreadyUnlocked = currentAchievements.unlocked.some(a => a.code === achievement.code);
      if (alreadyUnlocked) return;

      const lockedIndex = currentAchievements.locked.findIndex(
        a => a.label === achievement.label
      );

      const newUnlocked: UnlockedAchievementDto = {
        id: crypto.randomUUID(),
        code: achievement.code,
        label: achievement.label,
        description: achievement.description,
        icon: achievement.icon,
        color: achievement.color,
        createdAt: new Date(),
        unlockedAt: new Date()
      };

      const updatedLocked = lockedIndex !== -1
        ? currentAchievements.locked.filter((_, index) => index !== lockedIndex)
        : currentAchievements.locked;

      patchState(store, {
        achievementsUnlock: {
          unlocked: [...currentAchievements.unlocked, newUnlocked],
          locked: updatedLocked
        }
      });
    },
    updateEmail(email: string) {
      const currentVisitor = store.visitor();

      if (!currentVisitor) return;

      const verificationExpiresAt = new Date();
      verificationExpiresAt.setDate(verificationExpiresAt.getDate() + 14);

      patchState(store, {
        visitor: {
          ...currentVisitor,
          email,
          isVerified: false,
          verificationExpiresAt
        }
      });
    },
  }))
);
