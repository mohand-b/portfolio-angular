import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./routes/home/containers/home/home').then(m => m.Home)
  },
  {
    path: 'career',
    loadComponent: () => import('./routes/career/containers/career/career').then(m => m.Career)
  },
  {
    path: 'contact',
    loadComponent: () => import('./routes/contact/containers/contact/contact').then(m => m.Contact)
  },
  {
    path: 'skills',
    loadComponent: () => import('./routes/skills/containers/skills/skills').then(m => m.Skills)
  },
  {
    path: 'console',
    loadChildren: () => import('./routes/console/console.routes').then(m => m.consoleRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
