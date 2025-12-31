import {Component, inject} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {SKILL_CATEGORY_META, SkillCategory} from '../../state/skill/skill.model';
import {CoreFacade} from '../../../../core/core.facade';
import {environment} from '../../../../../../environments/environments';
import {SkillItem} from '../../components/skill-item/skill-item';

@Component({
  selector: 'app-skills',
  imports: [MatIcon, SkillItem],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  private readonly coreFacade = inject(CoreFacade);

  protected readonly skills = this.coreFacade.skills;
  protected readonly categories = Object.values(SkillCategory);
  protected readonly categoryMeta = SKILL_CATEGORY_META;

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
    return this.skills().filter(skill => skill.categories.includes(category));
  }
}
