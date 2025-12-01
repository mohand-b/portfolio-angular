import {Route} from '@angular/router';

export const publicRoutes: Route[] = [
  {
    path: 'accueil',
    loadComponent: () => import('./home/containers/home/home').then(m => m.Home),
    title: 'Accueil',
  },
  {
    path: 'parcours',
    loadComponent: () => import('./career/containers/career/career').then(m => m.Career),
    title: 'Parcours'
  },
  {
    path: 'competences',
    loadComponent: () => import('./skills/containers/skills/skills').then(m => m.Skills),
    title: 'Compétences'
  },
  {
    path: 'projets',
    loadComponent: () => import('./projects/containers/projects/projects').then(m => m.Projects),
    title: 'Projets'
  },
  {
    path: 'projets/:id',
    loadComponent: () => import('./projects/containers/project-detail/project-detail').then(m => m.ProjectDetail),
    title: 'Détail du projet'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/containers/contact/contact').then(m => m.Contact),
    title: 'Contact'
  },
  {
    path: 'verification-email',
    loadComponent: () => import('./verify-email/containers/verify-email/verify-email').then(m => m.VerifyEmail)
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./legal-notice/containers/legal-notice/legal-notice').then(m => m.LegalNotice),
    title: 'Mentions légales',
    data: {hideFromMenu: true}
  },
  {
    path: 'politique-de-confidentialite',
    loadComponent: () => import('./privacy-policy/containers/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
    title: 'Politique de confidentialité',
    data: {hideFromMenu: true}
  },
  {
    path: 'cgu',
    loadComponent: () => import('./terms-of-service/containers/terms-of-service/terms-of-service').then(m => m.TermsOfService),
    title: 'Conditions Générales d\'Utilisation',
    data: {hideFromMenu: true}
  },
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  }
]
