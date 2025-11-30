import {Component, inject} from '@angular/core';
import {CoreFacade} from '../../../../core/core.facade';
import {HomeHero} from '../../components/home-hero/home-hero';
import {HomeAbout} from '../../components/home-about/home-about';
import {HomeSkills} from '../home-skills/home-skills';
import {HomeProjectsStats} from '../home-projects-stats/home-projects-stats';
import {HomePersonal} from '../../components/home-personal/home-personal';
import {HomeContactBanner} from '../../components/home-contact-banner/home-contact-banner';

@Component({
  selector: 'app-home',
  imports: [HomeHero, HomeAbout, HomeSkills, HomeProjectsStats, HomePersonal, HomeContactBanner],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly coreFacade = inject(CoreFacade);

  readonly skills = this.coreFacade.skills;
}
