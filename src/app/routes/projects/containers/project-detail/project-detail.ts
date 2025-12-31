import {Component, computed, effect, inject, PLATFORM_ID, signal} from '@angular/core';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {httpResource} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {ProjectDto} from '../../state/project/project.model';
import {SKILL_CATEGORY_META, SkillCategory, SkillCategoryMeta, SkillDto} from '../../../skills/state/skill/skill.model';
import {environment} from '../../../../../../environments/environments';

@Component({
  selector: 'app-project-detail',
  imports: [MatButtonModule, MatIconModule, MatChipsModule, DatePipe],
  templateUrl: './project-detail.html'
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly paramMap = toSignal(this.route.paramMap);
  readonly projectId = computed(() => this.paramMap()?.get('id') ?? null);

  private readonly projectResource = httpResource<ProjectDto>(() => {
    if (!this.isBrowser) return {url: '', method: 'GET'};
    const id = this.projectId();
    if (!id) return {url: '', method: 'GET'};
    return {
      url: `${environment.baseUrl}/projects/${id}`,
      method: 'GET',
      withCredentials: true
    };
  });

  readonly project = computed(() => this.projectResource.value());
  readonly loading = computed(() => this.projectResource.isLoading());

  readonly currentImageIndex = signal(0);
  readonly images = computed(() => this.project()?.images || []);
  readonly hasMultipleImages = computed(() => this.images().length > 1);

  constructor() {
    effect(() => {
      const error = this.projectResource.error();
      if (error) {
        this.router.navigate(['/projets']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projets']);
  }

  nextImage(): void {
    const total = this.images().length;
    this.currentImageIndex.update(i => (i + 1) % total);
  }

  prevImage(): void {
    const total = this.images().length;
    this.currentImageIndex.update(i => (i - 1 + total) % total);
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  getCategoryMeta(category: SkillCategory): SkillCategoryMeta {
    return SKILL_CATEGORY_META[category];
  }

  getSkillsByCategory(): Array<[SkillCategory, SkillDto[]]> {
    const skills = this.project()?.skills || [];
    const grouped = new Map<SkillCategory, SkillDto[]>();

    skills.forEach(skill => {
      skill.categories.forEach(category => {
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)!.push(skill);
      });
    });

    const categoryOrder = Object.values(SkillCategory);
    return Array.from(grouped.entries()).sort((a, b) =>
      categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0])
    );
  }
}

