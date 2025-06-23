import {Component} from '@angular/core';
import {SkillCreate} from '../../../../console/containers/skill-create/skill-create';

@Component({
  selector: 'app-manage-skills',
  imports: [
    SkillCreate
  ],
  templateUrl: './manage-skills.html',
  styleUrl: './manage-skills.scss'
})
export class ManageSkills {

}
