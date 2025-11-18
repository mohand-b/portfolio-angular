import {inject} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {CoreFacade} from '../core.facade';

export function initializeVisitorSession(): () => Observable<any> {
  const coreFacade = inject(CoreFacade);
  return () => coreFacade.checkVisitorSession().pipe(catchError(() => of(null)));
}
