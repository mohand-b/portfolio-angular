import {Component, inject, signal, Signal} from '@angular/core';
import {SkillCreate} from '../../../../console/containers/skill-create/skill-create';
import {ConsoleFacade} from '../../console.facade';
import {SkillCategory, SkillDto} from '../../../skills/state/skill/skill.model';
import {SkillCategorySection} from '../../components/skill-category-section/skill-category-section';
import {SkillItem} from '../../components/skill-item/skill-item';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-manage-skills',
  standalone: true,
  imports: [
    SkillCreate,
    SkillCategorySection,
    SkillItem,
    MatIconModule,
    DragDropModule
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {
  public readonly categories: SkillCategory[] = Object.values(SkillCategory) as SkillCategory[];
  public readonly dropTrashId: string = 'trash';
  public readonly dropListIds: string[] = [...this.categories, this.dropTrashId];
  public readonly emptySkillList: SkillDto[] = [];
  public isDragging = signal<boolean>(false);
  private readonly consoleFacade: ConsoleFacade = inject(ConsoleFacade);
  public readonly skills: Signal<SkillDto[]> = this.consoleFacade.skills;

  public getSkillsByCategory(category: SkillCategory): SkillDto[] {
    return this.skills().filter(skill => skill.category === category);
  }

  public drop(event: CdkDragDrop<SkillDto[]>, newCategory: SkillCategory): void {
    if (event.previousContainer === event.container) return;
    const skill = event.item.data as SkillDto;
    this.consoleFacade.updateSkillCategory(skill.id, newCategory).subscribe();
  }

  public onSkillLevelChange(skill: SkillDto, newLevel: number): void {
    this.consoleFacade.updateSkillLevel(skill.id, newLevel).subscribe();
  }

  public onDropToTrash(event: CdkDragDrop<SkillDto[]>): void {
    const skill = event.item.data as SkillDto;
    this.consoleFacade.removeSkillById(skill.id).subscribe();
  }
}

