import {Component, computed, inject, signal, untracked} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {httpResource} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, of, switchMap} from 'rxjs';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {environment} from '../../../../../../environments/environments';
import {CoreFacade} from '../../../../core/core.facade';
import {Pagination} from '../../../../shared/components/pagination/pagination';
import {SKILL_CATEGORY_META, SkillCategory, SkillCategoryMeta, SkillDto} from '../../../skills/state/skill/skill.model';
import {SkillService} from '../../../skills/state/skill/skill.service';
import {ProjectItem} from '../../../console/manage-projects/components/project-item/project-item';
import {ProjectFilters, ProjectLightDto, PROJECT_TYPE_OPTIONS} from '../../state/project/project.model';

@Component({
  selector: 'app-projects',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    Pagination,
    ProjectItem
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private static readonly PAGE_SIZE = 6;

  private readonly skillService = inject(SkillService);
  private readonly route = inject(ActivatedRoute);
  private readonly coreFacade = inject(CoreFacade);

  readonly page = signal(1);
  readonly selectedTypes = signal<string[]>([]);
  readonly selectedSkills = signal<SkillDto[]>([]);
  readonly allProjectTypes = [...PROJECT_TYPE_OPTIONS];

  readonly skillSearchControl = new FormControl('');

  private readonly queryParams = toSignal(this.route.queryParamMap);
  private hasInitializedFromUrl = false;

  private readonly skillFromUrl = computed(() => {
    const skillId = this.queryParams()?.get('skillId');
    if (!skillId) return null;
    return this.coreFacade.skills().find(s => s.id === skillId) || null;
  });

  private readonly skillSearch$ = this.skillSearchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      if (typeof query !== 'string' || !query || query.trim().length < 2) return of([]);
      return this.skillService.searchSkills(query.trim(), 10);
    })
  );

  readonly filteredSkills = toSignal(this.skillSearch$, {initialValue: []});

  private readonly filters = computed<ProjectFilters>(() => {
    const skill = this.skillFromUrl();
    if (skill && !this.hasInitializedFromUrl) {
      untracked(() => {
        this.hasInitializedFromUrl = true;
        if (!this.selectedSkills().some(s => s.id === skill.id)) {
          this.selectedSkills.set([skill]);
        }
      });
    }

    return {
      projectTypes: this.selectedTypes().length > 0 ? this.selectedTypes() : undefined,
      skillIds: this.selectedSkills().length > 0 ? this.selectedSkills().map(s => s.id) : undefined,
    };
  });

  private readonly projectsResource = httpResource<{
    data: ProjectLightDto[];
    total: number;
    totalPages: number;
  }>(() => {
    const filters = this.filters();
    const params = new URLSearchParams({
      page: this.page().toString(),
      limit: Projects.PAGE_SIZE.toString()
    });

    if (filters.projectTypes?.length) {
      params.append('projectTypes', filters.projectTypes.join(','));
    }
    if (filters.skillIds?.length) {
      params.append('skillIds', filters.skillIds.join(','));
    }

    return {
      url: `${environment.baseUrl}/projects/list?${params.toString()}`,
      method: 'GET',
      withCredentials: true
    };
  });

  readonly projects = computed(() => this.projectsResource.value()?.data ?? []);
  readonly total = computed(() => this.projectsResource.value()?.total ?? 0);
  readonly totalPages = computed(() => this.projectsResource.value()?.totalPages ?? 0);
  readonly isLoading = computed(() => this.projectsResource.isLoading());
  readonly hasSearched = computed(() => this.projectsResource.value() !== undefined);

  onPageChange(newPage: number): void {
    this.page.set(newPage);
  }

  onTypeChange(types: string[]): void {
    this.selectedTypes.set(types);
    this.page.set(1);
  }

  onSkillSelected(event: MatAutocompleteSelectedEvent): void {
    const skill: SkillDto = event.option.value;
    if (!this.selectedSkills().some(s => s.id === skill.id)) {
      this.selectedSkills.set([...this.selectedSkills(), skill]);
      this.page.set(1);
    }
    this.skillSearchControl.setValue('');
  }

  removeSkill(skill: SkillDto): void {
    this.selectedSkills.set(this.selectedSkills().filter(s => s.id !== skill.id));
    this.page.set(1);
  }

  displaySkillName(skill: SkillDto | null): string {
    return skill?.name ?? '';
  }

  getCategoryMeta(category: SkillCategory): SkillCategoryMeta {
    return SKILL_CATEGORY_META[category];
  }

  sortedSelectedSkills(): SkillDto[] {
    const categoryOrder = Object.values(SkillCategory);
    return [...this.selectedSkills()].sort((a, b) => {
      const aFirstCategory = a.categories[0];
      const bFirstCategory = b.categories[0];
      return categoryOrder.indexOf(aFirstCategory) - categoryOrder.indexOf(bFirstCategory);
    });
  }
}
