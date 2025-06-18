import {Routes} from '@angular/router';
import {adminAuthGuard} from '../../core/guards/admin.guard';

export const consoleRoutes: Routes = [
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./../../layouts/console-layout/console-layout').then(m => m.ConsoleLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./containers/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
      },
      {
        path: 'achievements',
        loadComponent: () => import('./containers/achievements/achievements').then(m => m.Achievements),
        title: 'Succès',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./containers/login/login').then(m => m.Login),
    title: 'Login',
  },

];
