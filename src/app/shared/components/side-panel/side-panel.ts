import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-side-panel',
  imports: [],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel {

  readonly isOpen = input<boolean>();
  readonly closed = output<void>();

  requestClose() {
    this.closed.emit();
  }
}
