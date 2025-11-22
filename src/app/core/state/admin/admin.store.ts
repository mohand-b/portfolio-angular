import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed} from '@angular/core';

type SessionStatus = 'unknown' | 'checking' | 'authenticated' | 'unauthenticated';

interface AdminState {
  sessionStatus: SessionStatus;
  lastSessionError: string | null;
}

export const AdminStore = signalStore(
  {providedIn: 'root'},
  withState<AdminState>({
    sessionStatus: 'unknown',
    lastSessionError: null,
  }),
  withComputed((store) => ({
    canAccessAdmin: computed(() => store.sessionStatus() === 'authenticated'),
    isLoading: computed(() =>
      store.sessionStatus() === 'checking' || store.sessionStatus() === 'unknown'
    ),
  })),
  withMethods((store) => ({
    setSessionStatus(status: SessionStatus, error: string | null = null) {
      patchState(store, {
        sessionStatus: status,
        lastSessionError: error,
      })
    },
    setError(error: string) {
      patchState(store, {
        lastSessionError: error,
      })
    },
  })),
);
