import {Route} from '@angular/router';

export const publicRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./home/containers/home/home').then(m => m.Home),
    title: 'Home',
  },
  {
    path: 'career',
    loadComponent: () => import('./career/containers/career/career').then(m => m.Career),
    title: 'Career'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/containers/contact/contact').then(m => m.Contact),
    title: 'Contact'
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/containers/skills/skills').then(m => m.Skills),
    title: 'Skills'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
]
