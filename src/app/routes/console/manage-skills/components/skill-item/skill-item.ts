import {Component, computed, input, output} from '@angular/core';
import {NgClass} from '@angular/common';
import {SkillDto} from '../../../../skills/state/skill/skill.model';

@Component({
  selector: 'app-skill-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './skill-item.html'
})
export class SkillItem {
  readonly skill = input.required<SkillDto>();
  readonly setLevel = output<number>();

  protected readonly SEGMENTS = 5;
  protected readonly trackByIndex = (i: number) => i;

  protected readonly segments = computed(() => {
    return Array.from({length: this.SEGMENTS}, (_, i) => i);
  });

  protected readonly filledCount = computed(() => {
    const lvl = Math.round(this.skill()?.level ?? 0);
    return Math.max(0, Math.min(this.SEGMENTS, lvl));
  });

  onSetLevel(newLevel: number): void {
    this.setLevel.emit(Math.max(1, Math.min(this.SEGMENTS, newLevel)));
  }
}
