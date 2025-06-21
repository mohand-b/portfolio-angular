import {Routes} from '@angular/router';
import {adminAuthGuard} from '../../core/guards/admin.guard';

export const consoleRoutes: Routes = [
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./../../layouts/console-layout/console-layout').then(m => m.ConsoleLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./containers/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
      },
      {
        path: 'messages',
        loadComponent: () => import('./containers/manage-messages/manage-messages').then(m => m.ManageMessages),
        title: 'Messages',
      },
      {
        path: 'visitors',
        loadComponent: () => import('./containers/manage-visitors/manage-visitors').then(m => m.ManageVisitors),
        title: 'Visiteurs',
      },
      {
        path: 'timeline',
        loadComponent: () => import('./containers/manage-timeline/manage-timeline').then(m => m.ManageTimeline),
        title: 'Parcours',
      },
      {
        path: 'skills',
        loadComponent: () => import('./containers/manage-skills/manage-skills').then(m => m.ManageSkills),
        title: 'Compétences',
      },
      {
        path: 'projects',
        loadComponent: () => import('./containers/manage-projects/manage-projects').then(m => m.ManageProjects),
        title: 'Projets',
      },
      {
        path: 'achievements',
        loadComponent: () => import('./containers/achievements/achievements').then(m => m.Achievements),
        title: 'Succès',
      },
      {
        path: 'blog',
        loadComponent: () => import('./containers/manage-blog/manage-blog').then(m => m.ManageBlog),
        title: 'Blog',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./containers/login/login').then(m => m.Login),
    title: 'Login',
  },

];
