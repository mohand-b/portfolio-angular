import {afterNextRender, Component, DestroyRef, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {CoreFacade} from '../../../../core/core.facade';
import {HomeHero} from '../../components/home-hero/home-hero';
import {HomeAbout} from '../../components/home-about/home-about';
import {HomeSkills} from '../home-skills/home-skills';
import {HomeProjectsStats} from '../home-projects-stats/home-projects-stats';
import {HomePersonal} from '../../components/home-personal/home-personal';
import {HomeContactBanner} from '../../components/home-contact-banner/home-contact-banner';

const ACHIEVEMENT_ID = 'HOME1';
const TIME_TO_STAY_ON_PAGE_MS = 45000;
const PARALLAX_INTENSITY = 160;

@Component({
  selector: 'app-home',
  imports: [HomeHero, HomeAbout, HomeSkills, HomeProjectsStats, HomePersonal, HomeContactBanner],
  templateUrl: './home.html'
})
export class Home {
  private readonly coreFacade = inject(CoreFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly skills = this.coreFacade.skills;
  readonly parallaxOffset = signal(0);

  @ViewChild('photoSection') photoSection?: ElementRef;

  private readonly isVisitorAuthenticated = this.coreFacade.isVisitorAuthenticated;
  private readonly hasStayedLongEnough = signal(false);
  private readonly hasScrolledToBottom = signal(false);
  private readonly hasTracked = signal(false);

  constructor() {
    this.setupAchievementTracking();
    this.setupParallaxEffect();
  }

  private setupAchievementTracking(): void {
    afterNextRender(() => {
      const timer = setTimeout(() => this.hasStayedLongEnough.set(true), TIME_TO_STAY_ON_PAGE_MS);
      this.destroyRef.onDestroy(() => clearTimeout(timer));

      const footer = document.querySelector('app-footer');
      if (!footer) return;

      const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            this.hasScrolledToBottom.set(true);
          }
        }),
        {threshold: [0, 0.5, 1]}
      );

      observer.observe(footer);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });

    effect(() => {
      const shouldUnlock = !this.hasTracked()
        && this.isVisitorAuthenticated()
        && this.hasStayedLongEnough()
        && this.hasScrolledToBottom();

      if (shouldUnlock) {
        this.hasTracked.set(true);
        this.coreFacade.unlockAchievement(ACHIEVEMENT_ID).subscribe();
      }
    });
  }

  private setupParallaxEffect(): void {
    afterNextRender(() => {
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (!scrollContainer) return;

      const updateParallax = () => {
        const photoEl = this.photoSection?.nativeElement;
        if (!photoEl) return;

        const rect = photoEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = 1 - ((rect.top + rect.height / 2) / windowHeight);
          const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
          const offset = (clampedProgress - 0.5) * PARALLAX_INTENSITY;

          this.parallaxOffset.set(offset);
        }
      };

      setTimeout(updateParallax, 100);

      const scroll$ = fromEvent(scrollContainer, 'scroll', {passive: true}).subscribe(updateParallax);
      this.destroyRef.onDestroy(() => scroll$.unsubscribe());
    });
  }
}
