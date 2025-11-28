import {Component, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MenuEntry} from '../../../../shared/components/main-menu/main-menu';
import {consoleRoutes} from '../../console.routes';
import {MenuItem} from '../../../../shared/components/menu-item/menu-item';

@Component({
  selector: 'app-console-menu',
  imports: [MenuItem, MatIconModule, MatButtonModule],
  templateUrl: './console-menu.html',
  styleUrl: './console-menu.scss'
})
export class ConsoleMenu {
  private mainConsoleRoute = consoleRoutes.find(route => route.path === '');

  readonly mobileMenuOpen = signal(false);
  readonly menuItems: MenuEntry[] = this.mainConsoleRoute?.children
    ?.filter(child => child.title)
    .map(child => ({
      title: child.title as string,
      path: '/console/' + (child.path || ''),
      icon: child.icon
    })) || [];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
