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
        loadComponent: () => import('./dashboard/containers/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Dashboard',
        icon: 'dashboard',
      },
      {
        path: 'messages',
        loadComponent: () => import('./manage-messages/containers/manage-messages/manage-messages').then(m => m.ManageMessages),
        title: 'Messages',
        icon: 'chat',
      },
      {
        path: 'visitors',
        loadComponent: () => import('./manage-visitors/containers/manage-visitors/manage-visitors').then(m => m.ManageVisitors),
        title: 'Visiteurs',
        icon: 'group',
      },
      {
        path: 'timeline',
        loadComponent: () => import('./manage-timeline/containers/manage-timeline/manage-timeline').then(m => m.ManageTimeline),
        title: 'Parcours',
        icon: 'timeline',
      },
      {
        path: 'skills',
        loadComponent: () => import('./manage-skills/containers/manage-skills/manage-skills').then(m => m.ManageSkills),
        title: 'Compétences',
        icon: 'psychology',
      },
      {
        path: 'projects',
        loadComponent: () => import('./manage-timeline/containers/manage-projects/manage-projects').then(m => m.ManageProjects),
        title: 'Projets',
        icon: 'folder',
      },
      {
        path: 'achievements',
        loadComponent: () => import('./manage-achievements/containers/manage-achievements/manage-achievements').then(m => m.ManageAchievements),
        title: 'Succès',
        icon: 'emoji_events',
      },
      {
        path: 'blog',
        loadComponent: () => import('./manage-blog/containers/manage-blog/manage-blog').then(m => m.ManageBlog),
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
    loadComponent: () => import('./login/containers/login/login').then(m => m.Login),
    title: 'Login',
  },

];
