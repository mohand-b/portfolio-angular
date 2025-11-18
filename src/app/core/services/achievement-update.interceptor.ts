import {HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {CoreFacade} from '../core.facade';

export function achievementUpdateInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const coreFacade = inject(CoreFacade);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const isVisitorAuthRequest = req.url.includes('/visitor/me') ||
          (req.url.includes('/visitor') && req.method === 'POST');

        if (isVisitorAuthRequest) return;

        const hasAchievementUpdate = event.headers.get('X-Achievement-Updated') === 'true' ||
          (event.body && typeof event.body === 'object' && 'achievements' in event.body);
        if (hasAchievementUpdate) {
          coreFacade.checkVisitorSession().subscribe({error: () => {}});
        }
      }
    })
  );
}
