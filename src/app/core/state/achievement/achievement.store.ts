import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {Achievement, AchievementStats} from './achievement.model';
import {AchievementService} from './achievement.service';

interface AchievementState {
  achievements: Achievement[];
  total: number;
  totalActive: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: AchievementStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: AchievementState = {
  achievements: [],
  total: 0,
  totalActive: 0,
  page: 1,
  limit: 6,
  totalPages: 0,
  stats: {
    total: 0,
    totalActive: 0,
    totalUnlocked: 0,
    completionRate: 0
  },
  isLoading: false,
  error: null,
};

export const AchievementStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed(({page, total, totalActive, limit}) => ({
    startIndex: computed(() => (page() - 1) * limit() + 1),
    endIndex: computed(() => Math.min(page() * limit(), total())),
    totalAchievements: computed(() => total()),
    totalActiveAchievements: computed(() => totalActive()),
  })),
  withMethods((store, achievementService = inject(AchievementService)) => {
    const loadAchievements = rxMethod<{ page?: number; limit?: number }>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(({page = store.page(), limit = store.limit()}) =>
          achievementService.fetchPaginatedAchievements(page, limit).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  achievements: response.data,
                  total: response.total,
                  page: response.page,
                  limit: response.limit,
                  totalPages: response.totalPages,
                  isLoading: false,
                });
              },
              error: (error) => {
                patchState(store, {isLoading: false, error: error.message});
              },
            })
          )
        )
      )
    );

    const fetchStats = rxMethod<void>(
      pipe(
        switchMap(() => achievementService.fetchAchievementStats()),
        tap(stats => patchState(store, {
          stats,
          totalActive: stats.totalActive
        })),
      )
    );

    return {
      loadAchievements,
      fetchStats,
      setPage: (page: number) => loadAchievements({page}),
      nextPage: () => store.page() < store.totalPages() && loadAchievements({page: store.page() + 1}),
      previousPage: () => store.page() > 1 && loadAchievements({page: store.page() - 1}),
      addAchievement(achievement: Achievement): void {
        patchState(store, {
          total: store.total() + 1,
          totalActive: achievement.isActive ? store.totalActive() + 1 : store.totalActive()
        });
        loadAchievements({});
        fetchStats();
      },
      updateAchievement(code: string, achievement: Achievement): void {
        const achievements = store.achievements();
        const index = achievements.findIndex(a => a.code === code);
        if (index !== -1) {
          const oldAchievement = achievements[index];
          const updated = [...achievements];
          updated[index] = achievement;

          let totalActive = store.totalActive();
          if (oldAchievement.isActive && !achievement.isActive) {
            totalActive -= 1;
          } else if (!oldAchievement.isActive && achievement.isActive) {
            totalActive += 1;
          }

          patchState(store, {achievements: updated, totalActive});
          fetchStats();
        }
      },
      removeAchievementByCode(code: string): void {
        const achievement = store.achievements().find(a => a.code === code);
        if (achievement) {
          patchState(store, {
            total: store.total() - 1,
            totalActive: achievement.isActive ? store.totalActive() - 1 : store.totalActive()
          });
        }
        loadAchievements({});
        fetchStats();
      },
      reset: () => patchState(store, initialState),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadAchievements({page: 1});
      store.fetchStats();
    }
  })
);
