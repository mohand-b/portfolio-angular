import {Component} from '@angular/core';
import {MenuEntry} from '../../../../shared/components/main-menu/main-menu';
import {consoleRoutes} from '../../console.routes';
import {MenuItem} from '../../../../shared/components/menu-item/menu-item';

@Component({
  selector: 'app-console-menu',
  imports: [MenuItem],
  templateUrl: './console-menu.html',
  styleUrl: './console-menu.scss'
})
export class ConsoleMenu {

  private mainConsoleRoute = consoleRoutes.find(route => route.path === '');

  menuItems: MenuEntry[] = this.mainConsoleRoute?.children
    ?.filter(child => child.title)
    .map(child => ({
      title: child.title as string,
      path: '/console/' + (child.path || ''),
      icon: child.icon
    })) || [];


}
