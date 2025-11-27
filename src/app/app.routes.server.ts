import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Pages importantes pour le SEO - rendu côté serveur
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Server
  },
  // Toutes les autres routes - rendu côté client après hydration
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
