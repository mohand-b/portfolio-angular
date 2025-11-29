import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'home',
    renderMode: RenderMode.Server
  },
  {
    path: 'career',
    renderMode: RenderMode.Server
  },
  {
    path: 'skills',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'contact',
    renderMode: RenderMode.Server
  },
  {
    path: 'verify-email',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
