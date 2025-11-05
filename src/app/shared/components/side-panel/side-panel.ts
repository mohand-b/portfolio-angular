import {Component, DestroyRef, effect, inject, input, output, signal} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-side-panel',
  imports: [],
  templateUrl: './side-panel.html',
  animations: [
    trigger('slidePanel', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-out', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('fadeBackdrop', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({opacity: 0}))
      ])
    ])
  ]
})
export class SidePanel {
  private readonly destroyRef = inject(DestroyRef);

  readonly isOpen = input<boolean>();
  readonly closed = output<void>();

  protected readonly isVisible = signal(false);
  private closeTimeout?: number;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.isVisible.set(true);
      } else {
        this.closeTimeout = window.setTimeout(() => {
          this.isVisible.set(false);
        }, 300);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    });
  }

  requestClose() {
    this.closed.emit();
  }
}
