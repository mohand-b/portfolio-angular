import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed} from '@angular/core';

interface AdminState {
  accessToken: string | null;
}

export const AdminStore = signalStore(
  { providedIn: 'root' },
  withState<AdminState>({
    accessToken: null,
  }),
  withComputed((store) => ({
    authorizationHeader: computed(() => store.accessToken() ? `Bearer ${store.accessToken()}` : null)
  })),
  withMethods((store) => ({
    setToken(accessToken: string | null) {
      patchState(store, {accessToken});
    }
  }))
);
