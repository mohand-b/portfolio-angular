import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MenuItem} from '../menu-item/menu-item';
import {publicRoutes} from '../../../routes/public.routes';

export interface MenuEntry {
  title: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-main-menu',
  imports: [MenuItem, MatButtonModule, MatIconModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu {
  private readonly router = inject(Router);

  menuItems: MenuEntry[] = publicRoutes.filter(route => route.title).map(route => ({
    title: route.title,
    path: route.path
  })) as MenuEntry[];

  navigateToLogin(): void {
    this.router.navigate(['/console/login']);
  }
}
