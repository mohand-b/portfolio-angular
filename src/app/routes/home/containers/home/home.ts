import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SKILL_CATEGORY_META} from '../../../skills/state/skill/skill.model';
import {CoreFacade} from '../../../../core/core.facade';

interface FallingSkill {
  name: string;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  startY: number;
  endY: number;
}

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly router = inject(Router);
  private readonly coreFacade = inject(CoreFacade);

  readonly yearsOfExperience = 5;
  readonly projectsCount = 20;
  readonly technologiesCount = 15;

  readonly fallingSkills = computed<FallingSkill[]>(() => {
    const skills = this.coreFacade.skills();
    if (!skills.length) return [];

    return skills.map(skill => {
      const duration = 12 + Math.random() * 10;
      const startY = -50 + Math.random() * 70;
      return {
        name: skill.name,
        left: Math.random() * 100,
        duration,
        delay: -(Math.random() * duration),
        opacity: 0.2 + Math.random() * 0.2,
        color: SKILL_CATEGORY_META[skill.category].color,
        startY,
        endY: startY + 40 + Math.random() * 40
      };
    });
  });

  readonly skillPositions = signal<number[]>([]);

  getSkillLeft(index: number): number {
    return this.skillPositions()[index] ?? this.fallingSkills()[index]?.left ?? 0;
  }

  onAnimationIteration(index: number): void {
    const positions = [...this.skillPositions()];
    positions[index] = Math.random() * 100;
    this.skillPositions.set(positions);
  }

  navigateToCareer(): void {
    this.router.navigate(['/career']);
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
