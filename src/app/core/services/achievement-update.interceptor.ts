import {HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {AchievementDto} from '../state/achievement/achievement.model';
import {VisitorStore} from '../state/visitor/visitor.store';
import {ToastService} from '../../shared/services/toast.service';

export function achievementUpdateInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const toastService = inject(ToastService);
  const visitorStore = inject(VisitorStore);

  return next(req).pipe(
    tap(event => {
      if (!(event instanceof HttpResponse) || !event.body) return;

      const body = event.body as any;
      const achievements = body._achievements || (body.newAchievement ? [body.newAchievement] : null);

      if (!achievements || !Array.isArray(achievements) || achievements.length === 0) return;

      const isVisitorAuthResponse = req.url.includes('/visitor/authenticate');
      const shouldUpdateStore = !isVisitorAuthResponse && visitorStore.isAuthenticated();

      if (shouldUpdateStore) {
        achievements.forEach((achievement: AchievementDto) => {
          visitorStore.addUnlockedAchievement(achievement);
        });
        visitorStore.incrementAchievements(achievements.length);
      }

      const delay = isVisitorAuthResponse ? 10 : 0;
      setTimeout(() => {
        achievements.forEach((achievement: AchievementDto) => {
          toastService.achievement(achievement, 6000);
        });
      }, delay);
    })
  );
}
