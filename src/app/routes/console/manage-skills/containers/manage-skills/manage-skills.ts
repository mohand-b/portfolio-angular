import {Component, inject, signal, Signal} from '@angular/core';
import {filter, switchMap} from 'rxjs';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SkillCategory, SkillDto} from '../../../../skills/state/skill/skill.model';
import {ConsoleFacade} from '../../../console.facade';
import {SkillCategorySection} from '../../components/skill-category-section/skill-category-section';
import {SkillItem} from '../../components/skill-item/skill-item';
import {SkillCreate} from '../skill-create/skill-create';
import {GenericModal} from '../../../../../shared/components/generic-modal/generic-modal';
import {ModalService} from '../../../../../shared/services/modal.service';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';

@Component({
  selector: 'app-manage-skills',
  standalone: true,
  imports: [
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    SkillCategorySection,
    SkillItem,
    SkillCreate,
    SidePanel
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {
  private readonly modalService = inject(ModalService);
  private readonly consoleFacade = inject(ConsoleFacade);
  readonly categories: SkillCategory[] = Object.values(SkillCategory);
  readonly dropTrashId = 'trash';
  readonly dropListIds: string[] = [...this.categories, this.dropTrashId];
  readonly emptySkillList: SkillDto[] = [];
  readonly skills: Signal<SkillDto[]> = this.consoleFacade.skills;
  readonly isDragging = signal(false);
  readonly panelOpen = signal(false);

  getSkillsByCategory(category: SkillCategory): SkillDto[] {
    return this.skills().filter(skill => skill.category === category);
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }

  drop(event: CdkDragDrop<SkillDto[]>, newCategory: SkillCategory): void {
    if (event.previousContainer === event.container) return;
    const skill = event.item.data as SkillDto;
    this.modalService.open(GenericModal, {
      data: {
        title: 'Confirmer le déplacement',
        message: `Déplacer "${skill.name}" dans la catégorie "${newCategory}" ?`,
        actions: [
          {label: 'Annuler', value: 'cancel'},
          {label: 'Confirmer', value: 'confirm', style: 'filled'}
        ]
      },
      width: '350px'
    }).afterClosed().pipe(
      filter(result => result === 'confirm'),
      switchMap(() => this.consoleFacade.updateSkillCategory(skill.id, newCategory))
    ).subscribe();
  }

  onSkillLevelChange(skill: SkillDto, newLevel: number): void {
    this.modalService.open(GenericModal, {
      data: {
        title: 'Confirmer la modification',
        message: `Changer le niveau de "${skill.name}" à ${newLevel} ?`,
        actions: [
          {label: 'Annuler', value: 'cancel'},
          {label: 'Confirmer', value: 'confirm', style: 'filled'}
        ]
      },
      width: '350px'
    }).afterClosed().pipe(
      filter(result => result === 'confirm'),
      switchMap(() => this.consoleFacade.updateSkillLevel(skill.id, newLevel))
    ).subscribe();
  }

  onDropToTrash(event: CdkDragDrop<SkillDto[]>): void {
    const skill = event.item.data as SkillDto;
    this.modalService.open(GenericModal, {
      data: {
        title: 'Supprimer la compétence',
        message: `Supprimer définitivement "${skill.name}" ?`,
        actions: [
          {label: 'Annuler', value: 'cancel'},
          {label: 'Supprimer', value: 'delete', style: 'filled'}
        ]
      },
      width: '350px'
    }).afterClosed().pipe(
      filter(result => result === 'delete'),
      switchMap(() => this.consoleFacade.removeSkillById(skill.id))
    ).subscribe();
  }
}

