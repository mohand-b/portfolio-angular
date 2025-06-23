import {patchState, signalStore, withComputed, withHooks, withMethods, withProps} from '@ngrx/signals';
import {addEntity, removeEntities, setEntities, withEntities} from '@ngrx/signals/entities';
import {computed, inject} from '@angular/core';
import {SkillService} from './skill.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {SkillDto} from './skill.model';

export const SkillStore = signalStore(
  {providedIn: 'root'},
  withEntities<SkillDto>(),
  withProps(() => ({
    _skillService: inject(SkillService)
  })),
  withComputed(store => ({
    skills: computed(() =>
      store.entities()
        .slice()
        .sort((a, b) => b.level - a.level)
    ),
  })),
  withMethods(store => ({
    fetchSkills: rxMethod<void>(
      pipe(
        switchMap(() => store._skillService.fetchSkills()),
        tap(skills => patchState(store, setEntities(skills))),
      )
    ),
    addSkill(skill: SkillDto): void {
      patchState(store, addEntity(skill));
    },
    removeSkillById(id: string): void {
      patchState(store, removeEntities(skill => skill.id === id));
    },
  })),
  withHooks({
    onInit(store) {
      store.fetchSkills();
    }
  })
);
