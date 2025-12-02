import {effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {CoreFacade} from '../../core/core.facade';

const ACHIEVEMENT_ID = "DARKM";

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly coreFacade = inject(CoreFacade);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isDark = signal(false);
  private readonly alreadyUnlocked = signal(false);
  private readonly isVisitorAuthenticated = this.coreFacade.isVisitorAuthenticated;

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
    if (this.isVisitorAuthenticated() && !this.alreadyUnlocked() && this.isDark())
      this.coreFacade.unlockAchievement(ACHIEVEMENT_ID).subscribe({
        next: () => this.alreadyUnlocked.set(true)
      });
  }
}
