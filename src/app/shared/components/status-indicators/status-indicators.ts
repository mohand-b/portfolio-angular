import {
  afterNextRender,
  Component,
  computed,
  DOCUMENT,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  VERSION
} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {CoreFacade} from '../../../core/core.facade';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../../environments/environments';
import {MatTooltipModule} from '@angular/material/tooltip';

interface StatusIndicator {
  label: string;
  value: string | boolean;
  status: 'success' | 'error' | 'info';
  tooltip?: string;
}

@Component({
  selector: 'app-status-indicators',
  imports: [
    MatTooltipModule
  ],
  templateUrl: './status-indicators.html'
})
export class StatusIndicators {

  private readonly coreFacade = inject(CoreFacade);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private readonly angularVersion = VERSION.full;

  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly wasServerRendered = signal<boolean>(false);

  private readonly backendHealth = httpResource<any>(() => {
    if (!this.isBrowser) {
      return undefined;
    }
    return {
      url: `${environment.baseUrl}/health`,
      method: 'GET',
      withCredentials: true
    };
  });

  constructor() {
    if (!this.isBrowser) {
      this.wasServerRendered.set(true);
    } else {
      afterNextRender(() => {
        const appRoot = this.document.querySelector('app-root');
        const hasServerContext = appRoot?.hasAttribute('ng-server-context');
        this.wasServerRendered.set(!!hasServerContext);
      }, {injector: this.injector});
    }
  }

  readonly indicators = computed<StatusIndicator[]>(() => {
    const healthStatus = this.backendHealth.status();
    const isBackendOnline = healthStatus === 'resolved' && this.backendHealth.value() !== undefined;

    return [
      {
        label: 'Angular',
        value: `v${this.angularVersion}`,
        status: 'info',
        tooltip: 'Version actuelle du framework Angular'
      },
      {
        label: 'SSR Active',
        value: this.wasServerRendered(),
        status: this.wasServerRendered() ? 'success' : 'error',
        tooltip: this.wasServerRendered()
          ? 'Cette page a été rendue côté serveur'
          : 'Cette page a été rendue uniquement côté client'
      },
      {
        label: 'Zoneless Mode',
        value: true,
        status: 'success',
        tooltip: 'Réactivité via Signals, sans zone.js'
      },
      {
        label: 'Backend Online',
        value: isBackendOnline,
        status: isBackendOnline ? 'success' : 'error',
        tooltip: isBackendOnline
          ? `Connecté à ${environment.baseUrl}`
          : 'Backend indisponible'
      },
      {
        label: 'Authenticated',
        value: this.coreFacade.isVisitorAuthenticated(),
        status: this.coreFacade.isVisitorAuthenticated() ? 'success' : 'error',
        tooltip: this.coreFacade.isVisitorAuthenticated()
          ? 'Session utilisateur active'
          : 'Utilisateur non authentifié'
      }
    ];
  });
}
