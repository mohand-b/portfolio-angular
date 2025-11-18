import {Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {environment} from '../../../../../../environments/environments';
import {SKILL_CATEGORY_META, SkillDto} from '../../../skills/state/skill/skill.model';

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

interface FallingSkillPosition {
  left: number;
}

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly yearsOfExperience = 5;
  readonly projectsCount = 20;
  readonly technologiesCount = 15;

  private readonly skills = toSignal(
    this.http.get<SkillDto[]>(`${environment.baseUrl}/skills`),
    {initialValue: [] as SkillDto[]}
  );

  readonly fallingSkills = computed<FallingSkill[]>(() => {
    const skills = this.skills();
    if (!skills.length) return [];

    const result: FallingSkill[] = [];

    for (const skill of skills) {
      const duration = 12 + Math.random() * 10;
      const startY = -50 + Math.random() * 70;

      result.push({
        name: skill.name,
        left: Math.random() * 100,
        duration,
        delay: -(Math.random() * duration),
        opacity: 0.4 + Math.random() * 0.2,
        color: SKILL_CATEGORY_META[skill.category].color,
        startY,
        endY: startY + 40 + Math.random() * 40
      });
    }

    return result;
  });

  readonly skillPositions = signal<FallingSkillPosition[]>([]);

  getSkillLeft(index: number): number {
    const positions = this.skillPositions();
    return positions[index]?.left ?? this.fallingSkills()[index]?.left ?? 0;
  }

  onAnimationIteration(index: number): void {
    const positions = [...this.skillPositions()];
    positions[index] = {left: Math.random() * 100};
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
