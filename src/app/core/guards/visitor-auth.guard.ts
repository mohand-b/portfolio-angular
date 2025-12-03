import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {catchError, map, of} from 'rxjs';
import {CoreFacade} from '../core.facade';

export const visitorAuthGuard: CanActivateFn = () => {
  const coreFacade = inject(CoreFacade);
  const router = inject(Router);

  return coreFacade.checkVisitorSession().pipe(
    map(() => {
      const visitor = coreFacade.visitor();
      if (visitor) {
        return true;
      }
      return router.createUrlTree(['/accueil']);
    }),
    catchError(() => of(router.createUrlTree(['/accueil'])))
  );
};
