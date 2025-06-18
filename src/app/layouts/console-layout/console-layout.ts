import {Component, inject, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConsoleMenu} from '../../routes/console/components/console-menu/console-menu';
import {CoreFacade} from '../../core/core.facade';
import {Loader} from '../../shared/components/loader/loader';

@Component({
  selector: 'app-console-layout',
  imports: [RouterOutlet, ConsoleMenu, Loader],
  templateUrl: './console-layout.html',
  styleUrl: './console-layout.scss'
})
export class ConsoleLayout {

  private coreFacade = inject(CoreFacade);

  canAccessAdmin: Signal<boolean> = this.coreFacade.canAccessAdmin;
  isLoading: Signal<boolean> = this.coreFacade.isLoading;
}
