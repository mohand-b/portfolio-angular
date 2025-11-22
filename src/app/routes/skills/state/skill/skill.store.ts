import {patchState, signalStore, withComputed, withMethods, withProps} from '@ngrx/signals';
import {addEntity, removeEntities, setEntities, updateEntity, withEntities} from '@ngrx/signals/entities';
import {computed, inject} from '@angular/core';
import {SkillService} from './skill.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {SkillCategory, SkillDto} from './skill.model';

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
        tap((skills: SkillDto[]) => patchState(store, setEntities(skills))),
      )
    ),
    addSkill(skill: SkillDto): void {
      patchState(store, addEntity(skill));
    },
    updateSkillCategory(id: string, category: SkillCategory): void {
      patchState(store, updateEntity({id, changes: {category}}))
    },
    updateSkillLevel(id: string, level: number): void {
      patchState(store, updateEntity({id, changes: {level}}))
    },
    removeSkillById(id: string): void {
      patchState(store, removeEntities(skill => skill.id === id));
    },
  }))
);
