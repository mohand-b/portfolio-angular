import {Route} from '@angular/router';
import {adminAuthGuard} from '../../core/guards/admin.guard';


export interface CustomRoute extends Route {
  title?: string;
  icon?: string;
  children?: CustomRoute[];
}

export const consoleRoutes: CustomRoute[] = [
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./../../layouts/console-layout/console-layout').then(m => m.ConsoleLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./containers/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
        icon: 'dashboard',
      },
      {
        path: 'messages',
        loadComponent: () => import('./containers/manage-messages/manage-messages').then(m => m.ManageMessages),
        title: 'Messages',
        icon: 'chat',
      },
      {
        path: 'visitors',
        loadComponent: () => import('./containers/manage-visitors/manage-visitors').then(m => m.ManageVisitors),
        title: 'Visiteurs',
        icon: 'group',
      },
      {
        path: 'timeline',
        loadComponent: () => import('./containers/manage-timeline/manage-timeline').then(m => m.ManageTimeline),
        title: 'Parcours',
        icon: 'timeline',
      },
      {
        path: 'skills',
        loadComponent: () => import('./containers/manage-skills/manage-skills').then(m => m.ManageSkills),
        title: 'Compétences',
        icon: 'psychology',
      },
      {
        path: 'projects',
        loadComponent: () => import('./containers/manage-projects/manage-projects').then(m => m.ManageProjects),
        title: 'Projets',
        icon: 'folder',
      },
      {
        path: 'achievements',
        loadComponent: () => import('./containers/achievements/achievements').then(m => m.Achievements),
        title: 'Succès',
        icon: 'emoji_events',
      },
      {
        path: 'blog',
        loadComponent: () => import('./containers/manage-blog/manage-blog').then(m => m.ManageBlog),
        title: 'Blog',
        icon: 'article',
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
