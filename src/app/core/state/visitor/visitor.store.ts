import {Visitor} from './visitor.model';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed} from '@angular/core';

interface VisitorState {
  token: string | null;
  visitor: Visitor | null;
}

export const VisitorStore = signalStore(
{  providedIn: 'root',},
  withState<VisitorState>({
    token: null,
    visitor: null,
  }),
  withComputed((store) => ({
    authorizationHeader: computed(() => store.token ? `Bearer ${store.token}` : null),
  })),
  withMethods((store) => ({
    setToken(token: string | null) {
      patchState(store, {token});
    },
    setVisitor(visitor: Visitor | null) {
      patchState(store, {visitor});
    },
    clear() {
      patchState(store, {token: null, visitor: null});
    }
  }))
);

