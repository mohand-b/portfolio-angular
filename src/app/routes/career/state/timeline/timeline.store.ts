import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {TimelineItem, TimelineItemType} from './timeline.model';
import {TimelineService} from './timeline.service';

export interface TimelineState {
  items: TimelineItem[];
  loading: boolean;
  error: string | null;
  selectedTypes: TimelineItemType[];
}

const initialState: TimelineState = {
  items: [],
  loading: false,
  error: null,
  selectedTypes: []
};

export const TimelineStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withProps(() => ({_timelineService: inject(TimelineService)})),
  withComputed((store) => ({
    hasItems: computed(() => store.items().length > 0),
    filteredItems: computed(() => {
      const {items, selectedTypes} = {items: store.items(), selectedTypes: store.selectedTypes()};
      const filtered = selectedTypes.length === 0 ? items : items.filter(item => selectedTypes.includes(item.type));
      return [...filtered].sort((a, b) => {
        const aDate = a.endDate ? new Date(a.endDate).getTime() : Date.now();
        const bDate = b.endDate ? new Date(b.endDate).getTime() : Date.now();
        return bDate - aDate;
      });
    })
  })),
  withMethods((store) => ({
    setSelectedTypes: (types: TimelineItemType[]) => patchState(store, {selectedTypes: types}),
    addItem: (item: TimelineItem) => patchState(store, {items: [...store.items(), item]}),
    updateItem: (updatedItem: TimelineItem) => patchState(store, {
      items: store.items().map(item => item.id === updatedItem.id ? updatedItem : item)
    }),
    deleteItem: (itemId: string) => patchState(store, {
      items: store.items().filter(item => item.id !== itemId)
    }),
    fetchTimeline: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {loading: true, error: null})),
        switchMap(() => store._timelineService.getTimeline().pipe(
          tap({
            next: (items) => patchState(store, {items, loading: false}),
            error: (error: Error) => patchState(store, {error: error.message, loading: false}),
          })
        ))
      )
    )
  })),
  withHooks({onInit: (store) => store.fetchTimeline()})
);
