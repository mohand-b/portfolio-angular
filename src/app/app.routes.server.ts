import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'accueil',
    renderMode: RenderMode.Server
  },
  {
    path: 'parcours',
    renderMode: RenderMode.Server
  },
  {
    path: 'competences',
    renderMode: RenderMode.Server
  },
  {
    path: 'projets',
    renderMode: RenderMode.Server
  },
  {
    path: 'projets/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'contact',
    renderMode: RenderMode.Server
  },
  {
    path: 'profil',
    renderMode: RenderMode.Server
  },
  {
    path: 'verification-email',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
