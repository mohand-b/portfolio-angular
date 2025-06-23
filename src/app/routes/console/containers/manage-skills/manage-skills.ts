import {Component, inject, Signal} from '@angular/core';
import {SkillCreate} from '../../../../console/containers/skill-create/skill-create';
import {ConsoleFacade} from '../../console.facade';
import {SkillCategory, SkillDto} from '../../../skills/state/skill/skill.model';
import {SkillCategorySection} from '../../components/skill-category-section/skill-category-section';
import {SkillItem} from '../../components/skill-item/skill-item';

@Component({
  selector: 'app-manage-skills',
  imports: [
    SkillCreate,
    SkillCategorySection,
    SkillItem
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {

  public categories = Object.values(SkillCategory) as SkillCategory[];
  private consoleFacade = inject(ConsoleFacade);
  readonly skills: Signal<SkillDto[]> = this.consoleFacade.skills;

  public getSkillsByCategory(cat: SkillCategory): SkillDto[] {
    return this.skills().filter(skill => skill.category === cat);
  }

}
