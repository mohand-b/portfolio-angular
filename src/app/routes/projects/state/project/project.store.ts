import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {ProjectFilters, ProjectLightDto} from './project.model';
import {ProjectService} from './project.service';

interface ProjectState {
  projects: ProjectLightDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProjectFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  total: 0,
  page: 1,
  limit: 6,
  totalPages: 0,
  filters: {},
  isLoading: false,
  error: null,
};

export const ProjectStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed(({page, total, limit}) => ({
    startIndex: computed(() => (page() - 1) * limit() + 1),
    endIndex: computed(() => Math.min(page() * limit(), total())),
  })),
  withMethods((store, projectService = inject(ProjectService)) => {
    const loadProjects = rxMethod<{ page?: number; limit?: number; filters?: ProjectFilters }>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(({page = store.page(), limit = store.limit(), filters = store.filters()}) =>
          projectService.getProjects(page, limit, filters).pipe(
            tap({
              next: (response) => {
                patchState(store, {
                  projects: response.data,
                  total: response.total,
                  page: response.page,
                  limit: response.limit,
                  totalPages: response.totalPages,
                  filters,
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

    return {
      loadProjects,
      setPage: (page: number) => loadProjects({page}),
      nextPage: () => store.page() < store.totalPages() && loadProjects({page: store.page() + 1}),
      previousPage: () => store.page() > 1 && loadProjects({page: store.page() - 1}),
      setFilters: (filters: ProjectFilters) => loadProjects({page: 1, filters}),
      clearFilters: () => loadProjects({page: 1, filters: {}}),
      deleteProject: rxMethod<string>(
        pipe(
          switchMap((id) =>
            projectService.deleteProject(id).pipe(
              tap({
                next: () => loadProjects({}),
                error: (error) => patchState(store, {error: error.message}),
              })
            )
          )
        )
      ),
      reset: () => patchState(store, initialState),
    };
  })
);
