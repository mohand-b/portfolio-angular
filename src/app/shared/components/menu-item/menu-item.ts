import {Component, Input} from '@angular/core';
import {MenuEntry} from '../main-menu/main-menu';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-menu-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss'
})
export class MenuItem {

  @Input() menuEntry!: MenuEntry;

}
