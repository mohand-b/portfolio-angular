import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainMenu} from './shared/components/main-menu/main-menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected title = 'portfolio-angular';
}
