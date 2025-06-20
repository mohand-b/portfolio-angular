import {AfterViewInit, Directive, ElementRef, inject, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appFormFieldStyle]',
  standalone: true
})
export class FormFieldStyleDirective implements AfterViewInit {
  @Input() rounded = false;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const height = '2.75rem';
    const radius = this.rounded ? '9999px' : '0.375rem';

    this.renderer.setStyle(host, 'height', height);
    this.renderer.setStyle(host, 'overflow', 'hidden');
    this.renderer.setStyle(host, 'border-radius', radius);
    this.renderer.setStyle(host, 'isolation', 'isolate');

    const wrapper = host.querySelector('.mat-mdc-text-field-wrapper');
    if (wrapper) {
      this.renderer.setStyle(wrapper, 'padding', '0');
      this.renderer.setStyle(wrapper, 'height', '100%');
      this.renderer.setStyle(wrapper, 'display', 'flex');
      this.renderer.setStyle(wrapper, 'align-items', 'center');
      this.renderer.setStyle(wrapper, 'border-radius', radius);
    }

    const infix = host.querySelector('.mat-mdc-form-field-infix');
    if (infix) {
      this.renderer.setStyle(infix, 'padding', '0 1rem');
      this.renderer.setStyle(infix, 'height', '100%');
      this.renderer.setStyle(infix, 'display', 'flex');
      this.renderer.setStyle(infix, 'align-items', 'center');
    }

    const input = host.querySelector('input');
    if (input) {
      this.renderer.setStyle(input, 'height', '100%');
      this.renderer.setStyle(input, 'padding', '0');
      this.renderer.setStyle(input, 'margin', '0');
    }

    const outline = host.querySelector('.mdc-notched-outline');
    if (outline) {
      this.renderer.setStyle(outline, 'border-radius', radius);
      this.renderer.setStyle(outline, 'overflow', 'hidden');
    }

    const leading = host.querySelector('.mdc-notched-outline__leading');
    if (leading) {
      this.renderer.setStyle(leading, 'border-top-left-radius', radius);
      this.renderer.setStyle(leading, 'border-bottom-left-radius', radius);
    }

    const trailing = host.querySelector('.mdc-notched-outline__trailing');
    if (trailing) {
      this.renderer.setStyle(trailing, 'border-top-right-radius', radius);
      this.renderer.setStyle(trailing, 'border-bottom-right-radius', radius);
    }

    const notch = host.querySelector('.mdc-notched-outline__notch');
    if (notch) {
      this.renderer.setStyle(notch, 'border-left', '0');
      this.renderer.setStyle(notch, 'padding', '0');
      this.renderer.setStyle(notch, 'margin-left', '-1px');
      this.renderer.setStyle(notch, 'border-top-left-radius', radius);
      this.renderer.setStyle(notch, 'border-bottom-left-radius', radius);
    }
  }
}
