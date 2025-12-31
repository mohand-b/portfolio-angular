import {Component, computed, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {ProjectTimelineItem} from '../../../state/timeline/timeline.model';
import {SKILL_CATEGORY_META, SkillCategory} from '../../../../skills/state/skill/skill.model';

interface SkillGroup {
  category: SkillCategory;
  count: number;
  shortLabel: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-project-timeline-content',
  imports: [MatIcon],
  templateUrl: './project-timeline-content.html'
})
export class ProjectTimelineContent {
  readonly project = input.required<ProjectTimelineItem>();

  protected readonly skillGroups = computed<SkillGroup[]>(() => {
    const skills = this.project().skills;
    if (!skills?.length) return [];

    const categoryMap = new Map<SkillCategory, number>();
    skills.forEach(skill => {
      skill.categories.forEach(category => {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryMap.entries()).map(([category, count]) => {
      const {shortLabel, color, icon = ''} = SKILL_CATEGORY_META[category];
      return {category, count, shortLabel, color, icon};
    });
  });

  protected hexToRgba(hex: string, opacity: number): string {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
