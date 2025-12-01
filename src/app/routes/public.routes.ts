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
    path: 'verify-email',
    loadComponent: () => import('./verify-email/containers/verify-email/verify-email').then(m => m.VerifyEmail)
  },
  {
    path: 'legal-notice',
    loadComponent: () => import('./legal-notice/containers/legal-notice/legal-notice').then(m => m.LegalNotice),
    title: 'Mentions légales',
    data: { hideFromMenu: true }
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/containers/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
    title: 'Politique de confidentialité',
    data: { hideFromMenu: true }
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./terms-of-service/containers/terms-of-service/terms-of-service').then(m => m.TermsOfService),
    title: 'Conditions Générales d\'Utilisation',
    data: { hideFromMenu: true }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
]
