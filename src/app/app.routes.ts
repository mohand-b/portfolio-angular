import {Route} from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayout),
    loadChildren: () => import('./routes/public.routes').then(r => r.publicRoutes)
  },
  {
    path: 'console',
    loadComponent: () => import('./layouts/console-layout/console-layout').then(m => m.ConsoleLayout),
    loadChildren: () => import('./routes/console/console.routes').then(r => r.consoleRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
