import {Component, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SKILL_CATEGORY_META, SkillCategory} from '../../../skills/state/skill/skill.model';

@Component({
  selector: 'app-skill-category-section',
  imports: [
    MatIconModule,
  ],
  templateUrl: './skill-category-section.html',
  styleUrl: './skill-category-section.scss'
})
export class SkillCategorySection {

  @Input() category!: SkillCategory;

  protected readonly skillCategoryCatalog = SKILL_CATEGORY_META;
}
