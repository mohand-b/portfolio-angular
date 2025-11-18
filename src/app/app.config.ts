import {ApplicationConfig, inject, Injector, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, runInInjectionContext} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {routes} from './app.routes';
import {achievementUpdateInterceptor} from './core/services/achievement-update.interceptor';
import {authInterceptor} from './core/services/auth.interceptor';
import {initializeVisitorSession} from './core/services/visitor.initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, achievementUpdateInterceptor])),
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAppInitializer(() => runInInjectionContext(inject(Injector), initializeVisitorSession)()),
    provideClientHydration(withEventReplay())
  ]
};
