import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {catchError, map, of, switchMap} from 'rxjs';
import {CoreFacade} from '../core.facade';

export const adminAuthGuard: CanActivateFn = (): any => {
  const coreFacade = inject(CoreFacade);
  const router = inject(Router);

  return coreFacade.checkAdminSession().pipe(
    map(() => true),
    catchError((error) => {
      if (error.status === 401) {
        return coreFacade.revokeAdminToken().pipe(
          switchMap(() =>
            coreFacade.checkAdminSession().pipe(
              map(() => true),
              catchError(() => of(router.createUrlTree(['/console/login'])))
            )
          ),
          catchError(() => of(router.createUrlTree(['/console/login'])))
        );
      }
      return of(router.createUrlTree(['/console/login']));
    })
  );
};
