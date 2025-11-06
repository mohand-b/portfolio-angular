import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'svgSafe',
  standalone: true
})
export class SvgSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
