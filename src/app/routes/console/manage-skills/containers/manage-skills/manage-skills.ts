import {Component, inject, signal, Signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SKILL_CATEGORY_META, SkillCategory, SkillDto} from '../../../../skills/state/skill/skill.model';
import {ConsoleFacade} from '../../../console.facade';
import {SkillForm} from '../skill-form/skill-form';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {SkillItem} from '../../../../skills/components/skill-item/skill-item';

@Component({
  selector: 'app-manage-skills',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    SkillItem,
    SkillForm,
    SidePanel
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {
  private readonly consoleFacade = inject(ConsoleFacade);
  readonly categories: SkillCategory[] = Object.values(SkillCategory);
  readonly categoryMeta = SKILL_CATEGORY_META;
  readonly skills: Signal<SkillDto[]> = this.consoleFacade.skills;
  readonly panelOpen = signal(false);
  readonly editingSkill = signal<SkillDto | null>(null);

  getSkillsByCategory(category: SkillCategory): SkillDto[] {
    return this.skills().filter(skill => skill.categories.includes(category));
  }

  openPanel(): void {
    this.editingSkill.set(null);
    this.panelOpen.set(true);
  }

  openEditPanel(skill: SkillDto): void {
    this.editingSkill.set(skill);
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
    this.editingSkill.set(null);
  }
}

