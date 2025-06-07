import {Component, effect, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConsoleMenu} from '../../routes/console/components/console-menu/console-menu';
import {CoreFacade} from '../../core/core.facade';

@Component({
  selector: 'app-console-layout',
  imports: [RouterOutlet, ConsoleMenu],
  templateUrl: './console-layout.html',
  styleUrl: './console-layout.scss'
})
export class ConsoleLayout {


}
