import {  inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AdminStore} from '../state/admin/admin.store';

export const adminGuard: CanActivateFn = () => {
  const adminStore = inject(AdminStore);
  const router = inject(Router);

  if (adminStore.accessToken()) {
    return true
  } else {
    router.navigate(['/console/login']);
    return false;
  }

};
