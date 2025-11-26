import {Route} from '@angular/router';

export const publicRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./home/containers/home/home').then(m => m.Home),
    title: 'Accueil',
  },
  {
    path: 'career',
    loadComponent: () => import('./career/containers/career/career').then(m => m.Career),
    title: 'Parcours'
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/containers/skills/skills').then(m => m.Skills),
    title: 'Compétences'
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/containers/projects/projects').then(m => m.Projects),
    title: 'Projets'
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./projects/containers/project-detail/project-detail').then(m => m.ProjectDetail),
    title: 'Détail du projet'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/containers/contact/contact').then(m => m.Contact),
    title: 'Contact'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
]
