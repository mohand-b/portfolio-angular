import {Routes} from '@angular/router';
import {adminGuard} from '../../core/guards/admin.guard';

export const consoleRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./containers/login/login').then(m => m.Login),
    title: 'Login',
  },
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./../../layouts/console-layout/console-layout').then(m => m.ConsoleLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./containers/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      }
    ]
  },

];
