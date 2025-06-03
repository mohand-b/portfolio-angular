import {Component, Input} from '@angular/core';
import {MenuEntry} from '../main-menu/main-menu';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-menu-item',
  imports: [RouterLink],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss'
})
export class MenuItem {

  @Input() menuEntry!: MenuEntry;

}
