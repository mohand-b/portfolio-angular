import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {Achievement, AchievementStats} from './achievement.model';
import {addEntity, removeEntities, setEntities, updateEntity, withEntities} from '@ngrx/signals/entities';
import {computed, inject} from '@angular/core';
import {AchievementService} from './achievement.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';

interface AchievementState {
  stats: AchievementStats;
}

const initialState: AchievementState = {
  stats: {
    totalUnlocked: 0,
    completionRate: 0
  }
};

export const AchievementStore = signalStore(
  {providedIn: 'root'},
  withEntities<Achievement>(),
  withState<AchievementState>(initialState),
  withComputed(store => ({
    achievements: computed(() =>
      store.entities()
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    ),
    totalAchievements: computed(() => store.entities().length),
    totalActiveAchievements: computed(() =>
      store.entities().filter(a => a.isActive).length
    ),
  })),
  withMethods(store => {
    const achievementService = inject(AchievementService);

    return {
      fetchAchievements: rxMethod<void>(
        pipe(
          switchMap(() => achievementService.fetchAchievements()),
          tap(achievements => patchState(store, setEntities(achievements))),
        )
      ),
      fetchStats: rxMethod<void>(
        pipe(
          switchMap(() => achievementService.fetchAchievementStats()),
          tap(stats => patchState(store, {stats})),
        )
      ),
      addAchievement(achievement: Achievement): void {
        patchState(store, addEntity(achievement))
      },
      updateAchievement(code: string, achievement: Achievement): void {
        patchState(store, updateEntity({
          id: achievement.id,
          changes: achievement
        }));
      },
      removeAchievementByCode(code: string): void {
        patchState(store, removeEntities(achievement => achievement.code === code));
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.fetchAchievements();
      store.fetchStats();
    }
  })
);
