import {Component, computed, inject} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  CategoryStatDisplay,
  CategoryStatsResponse,
  SKILL_CATEGORY_META,
  SkillCategory
} from '../../../skills/state/skill/skill.model';
import {environment} from '../../../../../../environments/environments';

interface FeaturedSkill {
  name: string;
  logo: string;
  categories: SkillCategory[];
}

@Component({
  selector: 'app-home-skills',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home-skills.html'
})
export class HomeSkills {
  private readonly router = inject(Router);

  readonly featuredSkills: FeaturedSkill[] = [
    {name: 'Angular', logo: '/assets/angular_logo.webp', categories: [SkillCategory.FRONTEND]},
    {name: 'NestJS', logo: '/assets/nestjs_logo.svg', categories: [SkillCategory.BACKEND]},
    {name: 'TypeScript', logo: '/assets/ts_logo.png', categories: [SkillCategory.FRONTEND, SkillCategory.BACKEND]},
    {name: 'RxJS', logo: '/assets/rxjs_logo.png', categories: [SkillCategory.FRONTEND]},
    {name: 'React', logo: '/assets/react_logo.png', categories: [SkillCategory.FRONTEND]},
    {name: 'Git', logo: '/assets/git_logo.png', categories: [SkillCategory.TOOLING]}
  ];

  readonly featuredSkillsWithColor = computed(() => {
    return this.featuredSkills.map(skill => {
      if (skill.categories.length === 1) {
        const color = SKILL_CATEGORY_META[skill.categories[0]].color;
        return {
          ...skill,
          background: color + '15'
        };
      }
      const color1 = SKILL_CATEGORY_META[skill.categories[0]].color + '15';
      const color2 = SKILL_CATEGORY_META[skill.categories[1]].color + '15';
      return {
        ...skill,
        background: `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`
      };
    });
  });

  private readonly categoryStatsResource = httpResource<CategoryStatsResponse>(() => ({
    url: `${environment.baseUrl}/skills/stats`,
    method: 'GET'
  }));

  readonly topCategoryStats = computed<CategoryStatDisplay[]>(() => {
    const stats = this.categoryStatsResource.value()?.categoryStats ?? [];
    return stats
      .filter(stat => stat.usageRate > 0)
      .sort((a, b) => b.usageRate - a.usageRate)
      .slice(0, 4)
      .map(stat => {
        const meta = SKILL_CATEGORY_META[stat.category as SkillCategory];
        return {
          ...stat,
          label: meta?.label ?? stat.category,
          color: meta?.color ?? '#6366F1'
        };
      });
  });

  navigateToSkills(): void {
    this.router.navigate(['/competences']);
  }
}
