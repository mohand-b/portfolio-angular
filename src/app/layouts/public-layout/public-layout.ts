import { Component } from '@angular/core';
import {MainMenu} from '../../shared/components/main-menu/main-menu';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [MainMenu, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayout {

}
