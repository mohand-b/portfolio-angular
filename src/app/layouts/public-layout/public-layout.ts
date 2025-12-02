import {Component} from '@angular/core';
import {MainMenu} from '../../shared/components/main-menu/main-menu';
import {RouterOutlet} from '@angular/router';
import {Footer} from '../../shared/components/footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [MainMenu, RouterOutlet, Footer],
  templateUrl: './public-layout.html'
})
export class PublicLayout {

}
