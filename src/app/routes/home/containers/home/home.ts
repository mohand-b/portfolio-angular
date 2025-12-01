import {afterNextRender, Component, DestroyRef, effect, inject, signal} from '@angular/core';
import {CoreFacade} from '../../../../core/core.facade';
import {HomeHero} from '../../components/home-hero/home-hero';
import {HomeAbout} from '../../components/home-about/home-about';
import {HomeSkills} from '../home-skills/home-skills';
import {HomeProjectsStats} from '../home-projects-stats/home-projects-stats';
import {HomePersonal} from '../../components/home-personal/home-personal';
import {HomeContactBanner} from '../../components/home-contact-banner/home-contact-banner';

const ACHIEVEMENT_ID = 'HOME1';
const TIME_TO_STAY_ON_PAGE_MS = 45000;

@Component({
  selector: 'app-home',
  imports: [HomeHero, HomeAbout, HomeSkills, HomeProjectsStats, HomePersonal, HomeContactBanner],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly coreFacade = inject(CoreFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly skills = this.coreFacade.skills;

  private readonly isVisitorAuthenticated = this.coreFacade.isVisitorAuthenticated;

  private readonly hasStayedLongEnough = signal(false);
  private readonly hasScrolledToBottom = signal(false);
  private readonly hasTracked = signal(false);

  constructor() {
    afterNextRender(() => {
      const timer = setTimeout(() => {
        this.hasStayedLongEnough.set(true);
      }, TIME_TO_STAY_ON_PAGE_MS);

      this.destroyRef.onDestroy(() => clearTimeout(timer));

      const footer = document.querySelector('app-footer');

      if (footer) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              this.hasScrolledToBottom.set(true);
            }
          });
        }, {
          threshold: [0, 0.5, 1]
        });

        observer.observe(footer);
        this.destroyRef.onDestroy(() => observer.disconnect());
      }
    });

    effect(() => {
      if (!this.hasTracked() &&
        this.isVisitorAuthenticated() &&
        this.hasStayedLongEnough() &&
        this.hasScrolledToBottom()) {
        this.hasTracked.set(true);
        this.coreFacade.unlockAchievement(ACHIEVEMENT_ID).subscribe();
      }
    });
  }
}
