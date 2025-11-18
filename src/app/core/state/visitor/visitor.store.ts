import {computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Visitor} from './visitor.model';

interface VisitorState {
  visitor: Visitor | null;
}

export const VisitorStore = signalStore(
  {providedIn: 'root'},
  withState<VisitorState>({visitor: null}),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.visitor()),
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
    updateAchievements(achievements: {unlocked: number; total: number; percentCompletion: number}) {
      const currentVisitor = store.visitor();
      if (currentVisitor) {
        patchState(store, {visitor: {...currentVisitor, achievements}});
      }
    },
    clear() {
      patchState(store, {visitor: null});
    }
  }))
);

