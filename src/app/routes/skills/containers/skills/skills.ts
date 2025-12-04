import {Component, inject} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {SKILL_CATEGORY_META, SkillCategory, SkillDto} from '../../state/skill/skill.model';
import {CoreFacade} from '../../../../core/core.facade';
import {environment} from '../../../../../../environments/environments';
import {hexWithAlpha} from '../../../../shared/utils/color.utils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-skills',
  imports: [MatIcon],
  templateUrl: './skills.html'
})
export class Skills {
  private readonly coreFacade = inject(CoreFacade);
  private readonly router = inject(Router);

  protected readonly skills = this.coreFacade.skills;
  protected readonly categories = Object.values(SkillCategory);
  protected readonly categoryMeta = SKILL_CATEGORY_META;
  protected readonly hexWithAlpha = hexWithAlpha;

  private readonly trackVisit = httpResource<void>(() => {
    const visitor = this.coreFacade.visitor();
    return visitor ?
      {
        url: `${environment.baseUrl}/visitor/page-visit/skills`,
        method: 'POST',
        body: {},
        withCredentials: true
      } : undefined;
  });

  protected getSkillsByCategory(category: SkillCategory) {
    return this.skills().filter(skill => skill.category === category);
  }

  protected navigateToProjects(skill: SkillDto): void {
    this.router.navigate(['/projets'], {
      queryParams: {skillId: skill.id}
    });
  }
}
