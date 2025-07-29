import {Component} from '@angular/core';
import {MenuItem} from '../menu-item/menu-item';
import {publicRoutes} from '../../../routes/public.routes';

export interface MenuEntry {
  title: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-main-menu',
  imports: [MenuItem],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu {

  menuItems: MenuEntry[] = publicRoutes.filter(route => route.title).map(route => ({
    title: route.title,
    path: route.path
  })) as MenuEntry[];

}
