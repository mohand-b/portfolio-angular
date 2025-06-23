import {Component, inject, Signal} from '@angular/core';
import {SkillCreate} from '../../../../console/containers/skill-create/skill-create';
import {ConsoleFacade} from '../../console.facade';
import {SkillDto} from '../../../skills/state/skill/skill.model';

@Component({
  selector: 'app-manage-skills',
  imports: [
    SkillCreate
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {

  private consoleFacade = inject(ConsoleFacade);

  readonly skills: Signal<SkillDto[]> = this.consoleFacade.skills;

}
