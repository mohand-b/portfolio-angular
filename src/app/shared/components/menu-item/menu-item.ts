import {Component, Input} from '@angular/core';
import {MenuEntry} from '../main-menu/main-menu';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-menu-item',
  imports: [RouterLink, RouterLinkActive, MatIconModule, NgClass],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss'
})
export class MenuItem {

  @Input() menuEntry!: MenuEntry;

}
