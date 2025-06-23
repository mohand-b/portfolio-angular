import {Component, Input, output} from '@angular/core';
import {SkillDto} from '../../../skills/state/skill/skill.model';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-skill-item',
  imports: [MatIconModule],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.scss'
})
export class SkillItem {

  @Input() skill!: SkillDto;
  setLevel = output<number>();

  get stars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Math.round(this.skill.level ?? 0));
  }

  onSetLevel(newLevel: number) {
    this.setLevel.emit(newLevel);
  }

}
