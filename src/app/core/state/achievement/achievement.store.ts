import {patchState, signalStore, withHooks, withMethods, withProps} from '@ngrx/signals';
import {Achievement} from './achievement.model';
import {addEntity, setEntities, withEntities} from '@ngrx/signals/entities';
import {inject} from '@angular/core';
import {AchievementService} from './achievement.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';

export const AchievementStore = signalStore(
  {providedIn: 'root'},
  withEntities<Achievement>(),
  withProps(() => ({
    _achievementService: inject(AchievementService)
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
    }
  })),
  withHooks({
    onInit(store) {
      store.fetchAchievements();
    }
  })
);
