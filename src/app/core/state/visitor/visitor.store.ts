import {computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {calculateAchievementPercentage, Visitor} from './visitor.model';

interface VisitorState {
  visitor: Visitor | null;
}

export const VisitorStore = signalStore(
  {providedIn: 'root'},
  withState<VisitorState>({visitor: null}),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.visitor()),
    isVerified: computed(() => store.visitor()?.isVerified || false),
    fullName: computed(() => {
      const visitor = store.visitor();
      return visitor ? `${visitor.firstName} ${visitor.lastName}` : null;
    }),
    achievements: computed(() => store.visitor()?.achievements || null),
    percentCompletion: computed(() => store.visitor()?.achievements?.percentCompletion || 0),
  })),
  withMethods((store) => ({
    setVisitor(visitor: Visitor | null) {
      patchState(store, {visitor});
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
      patchState(store, {visitor: null});
    }
  }))
);
