import {patchState, signalStore, withComputed, withHooks, withMethods, withProps} from '@ngrx/signals';
import {Achievement} from './achievement.model';
import {addEntity, removeEntities, setEntities, withEntities} from '@ngrx/signals/entities';
import {computed, inject} from '@angular/core';
import {AchievementService} from './achievement.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';

export const AchievementStore = signalStore(
  {providedIn: 'root'},
  withEntities<Achievement>(),
  withProps(() => ({
    _achievementService: inject(AchievementService)
  })),
  withComputed(store => ({
    achievements: computed(() =>
      store.entities()
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(a => ({
          code: a.code,
          label: a.label,
          description: a.description,
        }))
    ),
  })),
  withMethods(store => ({
    fetchAchievements: rxMethod<void>(
      pipe(
        switchMap(() => store._achievementService.fetchAchievements()),
        tap(achievements => patchState(store, setEntities(achievements))),
      )
    ),
    addAchievement(achievement: Achievement): void {
      patchState(store, addEntity(achievement))
    },
    removeAchievementByCode(code: string): void {
      patchState(store, removeEntities(achievement => achievement.code === code));
    },
  })),
  withHooks({
    onInit(store) {
      store.fetchAchievements();
    }
  })
);
