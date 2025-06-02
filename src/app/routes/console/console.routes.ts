import {Routes} from '@angular/router';

export const consoleRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/dashboard/dashboard').then(m => m.Dashboard)
  }
];
