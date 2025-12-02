import {Injectable, signal, effect, PLATFORM_ID, inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isDark = signal(false);

  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(stored === 'dark' || (!stored && prefersDark));

      effect(() => {
        const theme = this.isDark() ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      });
    }
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
