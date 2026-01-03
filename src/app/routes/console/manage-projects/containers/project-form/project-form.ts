import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, of, switchMap} from 'rxjs';
import {environment} from '../../../../../../../environments/environments';
import {ToastService} from '../../../../../shared/services/toast.service';
import {StepConfig, Stepper} from '../../../../../shared/components/stepper/stepper';
import {JobMinimalDto} from '../../../../career/state/job/job.model';
import {
  MediaMetadata,
  PROJECT_MARKET_LABELS,
  PROJECT_SCOPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_VISIBILITY_LABELS,
  ProjectDto,
  ProjectMarket,
  ProjectScope,
  ProjectStatus,
  ProjectVisibility,
  TEAM_ROLE_LABELS,
  TeamRole
} from '../../../../projects/state/project/project.model';
import {SkillService} from '../../../../skills/state/skill/skill.service';
import {
  SKILL_CATEGORY_META,
  SkillCategory,
  SkillCategoryMeta,
  SkillDto
} from '../../../../skills/state/skill/skill.model';
import {ConsoleFacade} from '../../../console.facade';

@Component({
  selector: 'app-project-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatChipsModule,
    Stepper
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss'
})
export class ProjectForm {
  private readonly fb = inject(FormBuilder);
  private readonly skillService = inject(SkillService);
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);

  readonly project = input<ProjectDto | null>(null);
  readonly saved = output<void>();

  readonly step = signal(0);
  readonly achievements = signal<string[]>([]);
  readonly challenges = signal<string[]>([]);
  readonly domains = signal<string[]>([]);
  readonly teamComposition = signal<Array<{ role: TeamRole; count: number }>>([]);
  readonly myRole = signal<TeamRole | null>(null);
  readonly images = signal<Array<{ file: File; preview: string; metadata: MediaMetadata }>>([]);
  readonly existingImages = signal<Array<{ url: string; metadata: MediaMetadata }>>([]);
  readonly selectedSkills = signal<SkillDto[]>([]);
  readonly isEditing = computed(() => !!this.project());
  readonly teamSize = computed(() => this.teamComposition().reduce((sum, item) => sum + item.count, 0));

  private readonly jobsResource = httpResource<JobMinimalDto[]>(() => ({
    url: `${environment.baseUrl}/jobs/minimal`,
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
  }));

  readonly jobs = computed(() => this.jobsResource.value() ?? []);

  readonly achievementControl = this.fb.control('');
  readonly challengeControl = this.fb.control('');
  readonly domainControl = this.fb.control('');
  readonly skillSearchControl = this.fb.control('');
  readonly myRoleControl = this.fb.control<TeamRole | null>(null);
  readonly teamRoleSearchControl = this.fb.control('');

  readonly teamRoleOptions = Object.values(TeamRole);

  private readonly skillSearch$ = this.skillSearchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      if (typeof query !== 'string' || !query || query.trim().length < 2) {
        return of([]);
      }
      return this.skillService.searchSkills(query.trim(), 5);
    })
  );

  readonly filteredSkills = toSignal(this.skillSearch$, {initialValue: []});

  private readonly teamRoleSearch$ = this.teamRoleSearchControl.valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(query => {
      const search = (query || '').toLowerCase().trim();
      if (!search) return of(this.teamRoleOptions);
      return of(this.teamRoleOptions.filter(role =>
        this.TeamRoleLabels[role].toLowerCase().includes(search)
      ));
    })
  );

  readonly filteredTeamRoles = toSignal(this.teamRoleSearch$, {initialValue: this.teamRoleOptions});

  readonly form = this.fb.group({
    step1: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      status: [ProjectStatus.IN_PROGRESS],
      visibility: [ProjectVisibility.DRAFT],
      companyProject: [false],
      jobId: [null as string | null],
    }),
    step2: this.fb.group({
      projectTypes: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
      scope: this.fb.control<ProjectScope | null>(null),
      market: this.fb.control<ProjectMarket | null>(null),
    }),
    step3: this.fb.group({
      context: [''],
      problem: [''],
      solution: [''],
    }),
    step4: this.fb.group({}),
  });

  readonly stepsMeta: StepConfig[] = [
    {icon: 'info', text: 'Informations'},
    {icon: 'category', text: 'Catégorie'},
    {icon: 'lightbulb', text: 'Approche'},
    {icon: 'emoji_events', text: 'Réalisations'},
    {icon: 'photo_library', text: 'Médias'}
  ];

  readonly projectTypeOptions = PROJECT_TYPE_OPTIONS;
  readonly projectStatusOptions = Object.values(ProjectStatus);
  readonly projectVisibilityOptions = Object.values(ProjectVisibility);
  readonly projectScopeOptions = Object.values(ProjectScope);
  readonly projectMarketOptions = Object.values(ProjectMarket);

  readonly ProjectStatusLabels = PROJECT_STATUS_LABELS;
  readonly ProjectVisibilityLabels = PROJECT_VISIBILITY_LABELS;
  readonly ProjectScopeLabels = PROJECT_SCOPE_LABELS;
  readonly ProjectMarketLabels = PROJECT_MARKET_LABELS;
  readonly TeamRoleLabels = TEAM_ROLE_LABELS;

  readonly Math = Math;

  get s1(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }

  get s2(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }

  get s3(): FormGroup {
    return this.form.get('step3') as FormGroup;
  }

  get s4(): FormGroup {
    return this.form.get('step4') as FormGroup;
  }

  constructor() {
    effect(() => {
      const proj = this.project();
      if (proj) {
        this.s1.patchValue({
          title: proj.title,
          description: proj.description || '',
          status: proj.status,
          visibility: proj.visibility,
          companyProject: proj.companyProject,
          jobId: proj.job?.id || null
        });
        this.s2.patchValue({
          projectTypes: proj.projectTypes,
          scope: proj.scope || null,
          market: proj.market || null
        });
        this.s3.patchValue({
          context: proj.context || '',
          problem: proj.problem || '',
          solution: proj.solution || '',
        });
        this.achievements.set(proj.achievements || []);
        this.challenges.set(proj.challenges || []);
        this.domains.set(proj.domains || []);

        const roleCountMap = new Map<TeamRole, number>();
        (proj.teamComposition || []).forEach(role => {
          roleCountMap.set(role, (roleCountMap.get(role) || 0) + 1);
        });
        const teamArray = Array.from(roleCountMap.entries()).map(([role, count]) => ({
          role,
          count
        }));
        this.teamComposition.set(teamArray);

        const roleTitle = proj.roleTitle as TeamRole;
        this.myRoleControl.setValue(roleTitle || null);
        if (roleTitle) {
          this.myRole.set(roleTitle);
        }
        this.selectedSkills.set(proj.skills || []);
        this.images.set([]);
        this.existingImages.set(proj.media?.map(m => ({
          url: m.url,
          metadata: {name: m.name, alt: m.alt, isCover: m.isCover}
        })) || []);
      } else {
        this.resetForm();
      }
    });
    effect(() => {
      if (!this.s1.get('companyProject')?.value) {
        this.s1.get('jobId')?.setValue(null);
      }
    });

    this.myRoleControl.valueChanges.subscribe(role => {
      const oldRole = this.myRole();

      if (oldRole && oldRole !== role) {
        this.decrementRole(oldRole);
      }

      if (role) {
        this.incrementRole(role);
        this.myRole.set(role);
      } else {
        this.myRole.set(null);
      }
    });
  }

  next(): void {
    const current = this.form.get(`step${this.step() + 1}`);
    if (current && current.invalid) {
      current.markAllAsTouched();
      return;
    }
    if (this.step() < this.stepsMeta.length - 1) {
      this.step.update(v => v + 1);
    }
  }

  prev(): void {
    if (this.step() > 0) {
      this.step.update(v => v - 1);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      [this.s1, this.s2, this.s3, this.s4].forEach(s => s.markAllAsTouched());
      if (this.s1.invalid) this.step.set(0);
      else if (this.s2.invalid) this.step.set(1);
      else if (this.s3.invalid) this.step.set(2);
      else if (this.s4.invalid) this.step.set(3);
      return;
    }

    const {step1, step2, step3} = this.form.getRawValue();
    const formData = new FormData();

    formData.append('title', step1.title!.trim());
    formData.append('projectTypes', JSON.stringify(step2.projectTypes!));

    if (step1.description) formData.append('description', step1.description.trim());
    formData.append('status', step1.status!);
    formData.append('visibility', step1.visibility!);

    formData.append('companyProject', String(step1.companyProject));
    if (step1.companyProject && step1.jobId) {
      formData.append('jobId', step1.jobId);
    }
    if (this.myRoleControl.value) {
      formData.append('roleTitle', this.myRoleControl.value);
    }
    if (this.teamComposition().length > 0) {
      const teamArray: TeamRole[] = [];
      this.teamComposition().forEach(item => {
        for (let i = 0; i < item.count; i++) {
          teamArray.push(item.role);
        }
      });
      formData.append('teamComposition', JSON.stringify(teamArray));
    }

    if (step2.scope) formData.append('scope', step2.scope);
    if (step2.market) formData.append('market', step2.market);
    if (this.domains().length > 0) {
      formData.append('domains', JSON.stringify(this.domains()));
    }

    if (step3.context) formData.append('context', step3.context.trim());
    if (step3.problem) formData.append('problem', step3.problem.trim());
    if (step3.solution) formData.append('solution', step3.solution.trim());

    if (this.achievements().length > 0) {
      formData.append('achievements', JSON.stringify(this.achievements()));
    }
    if (this.challenges().length > 0) {
      formData.append('challenges', JSON.stringify(this.challenges()));
    }

    if (this.selectedSkills().length > 0) {
      formData.append('skillIds', JSON.stringify(this.selectedSkills().map(skill => skill.id)));
    }

    if (this.isEditing() && this.existingImages().length === 0 && this.images().length === 0) {
      formData.append('removeAllMedia', 'true');
    }

    this.images().forEach(img => {
      formData.append('images', img.file);
    });

    const allMediaMetadata: MediaMetadata[] = [
      ...this.existingImages().map(img => img.metadata),
      ...this.images().map(img => img.metadata)
    ];

    if (allMediaMetadata.length > 0) {
      formData.append('mediaMetadata', JSON.stringify(allMediaMetadata));
    }

    const operation$ = this.isEditing()
      ? this.consoleFacade.updateProject(this.project()!.id, formData)
      : this.consoleFacade.addProject(formData);

    operation$.subscribe({
      next: () => {
        const message = this.isEditing() ? 'Projet modifié avec succès' : 'Projet créé avec succès';
        this.toastService.success(message);
        if (!this.isEditing()) {
          this.resetForm();
        }
        this.saved.emit();
      },
      error: () => {
        const message = this.isEditing()
          ? 'Erreur lors de la modification du projet'
          : 'Erreur lors de la création du projet';
        this.toastService.error(message);
        [this.s1, this.s2, this.s3, this.s4].forEach(s => s.markAllAsTouched());
      },
    });
  }

  onSkillSelected(event: MatAutocompleteSelectedEvent): void {
    const skill: SkillDto = event.option.value;
    const current = this.selectedSkills();
    if (!current.some(s => s.id === skill.id)) {
      this.selectedSkills.set([...current, skill]);
    }
    this.skillSearchControl.setValue('');
  }

  removeSkill(skill: SkillDto): void {
    this.selectedSkills.set(this.selectedSkills().filter(s => s.id !== skill.id));
  }

  addAchievement(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const value = (this.achievementControl.value ?? '').trim();
    if (!value) return;
    this.achievements.update(arr => [...arr, value]);
    this.achievementControl.reset('');
  }

  removeAchievement(index: number): void {
    this.achievements.update(arr => arr.filter((_, i) => i !== index));
  }

  addChallenge(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const value = (this.challengeControl.value ?? '').trim();
    if (!value) return;
    this.challenges.update(arr => [...arr, value]);
    this.challengeControl.reset('');
  }

  removeChallenge(index: number): void {
    this.challenges.update(arr => arr.filter((_, i) => i !== index));
  }

  addDomain(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const value = (this.domainControl.value ?? '').trim();
    if (!value) return;
    this.domains.update(arr => [...arr, value]);
    this.domainControl.reset('');
  }

  removeDomain(index: number): void {
    this.domains.update(arr => arr.filter((_, i) => i !== index));
  }

  private incrementRole(role: TeamRole): void {
    this.teamComposition.update(arr => {
      const existing = arr.find(item => item.role === role);
      if (existing) {
        return arr.map(item =>
          item.role === role ? {...item, count: item.count + 1} : item
        );
      } else {
        return [...arr, {role, count: 1}];
      }
    });
  }

  private decrementRole(role: TeamRole): void {
    this.teamComposition.update(arr => {
      const existing = arr.find(item => item.role === role);
      if (!existing) return arr;

      if (existing.count > 1) {
        return arr.map(item =>
          item.role === role ? {...item, count: item.count - 1} : item
        );
      } else {
        if (this.myRole() === role) {
          this.myRoleControl.setValue(null, {emitEvent: false});
          this.myRole.set(null);
        }
        return arr.filter(item => item.role !== role);
      }
    });
  }

  onTeamRoleSelected(event: MatAutocompleteSelectedEvent): void {
    const role: TeamRole = event.option.value;
    this.incrementRole(role);
    this.teamRoleSearchControl.setValue('');
  }

  incrementTeamRole(role: TeamRole): void {
    this.incrementRole(role);
  }

  decrementTeamRole(role: TeamRole): void {
    this.decrementRole(role);
  }

  displayTeamRole = (): string => '';

  onFilesSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const availableSlots = 10 - this.totalImages;
    if (availableSlots <= 0) {
      this.toastService.error('Maximum 10 images autorisées');
      return;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    files.slice(0, availableSlots).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        this.toastService.error(`Type non autorisé: ${file.name}. Formats acceptés: PNG, JPEG, WEBP`);
        return;
      }
      if (file.size > maxSize) {
        this.toastService.error(`Fichier trop volumineux: ${file.name}. Max 5MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const hasCover = this.images().some(img => img.metadata.isCover) || this.existingImages().some(img => img.metadata.isCover);
        this.images.update(imgs => [...imgs, {
          file,
          preview: reader.result as string,
          metadata: {
            name: file.name,
            alt: '',
            isCover: !hasCover && imgs.length === 0
          }
        }]);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeImage(index: number): void {
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
  }

  removeExistingImage(index: number): void {
    this.existingImages.update(imgs => imgs.filter((_, i) => i !== index));
  }

  setCoverImage(index: number, isNew: boolean): void {
    if (isNew) {
      this.images.update(imgs => imgs.map((img, i) => ({
        ...img,
        metadata: {...img.metadata, isCover: i === index}
      })));
      this.existingImages.update(imgs => imgs.map(img => ({
        ...img,
        metadata: {...img.metadata, isCover: false}
      })));
    } else {
      this.existingImages.update(imgs => imgs.map((img, i) => ({
        ...img,
        metadata: {...img.metadata, isCover: i === index}
      })));
      this.images.update(imgs => imgs.map(img => ({
        ...img,
        metadata: {...img.metadata, isCover: false}
      })));
    }
  }

  get totalImages(): number {
    return this.images().length + this.existingImages().length;
  }

  setScope(value: ProjectScope): void {
    const currentValue = this.s2.get('scope')?.value;
    this.s2.get('scope')?.setValue(currentValue === value ? null : value);
  }

  setMarket(value: ProjectMarket): void {
    const currentValue = this.s2.get('market')?.value;
    this.s2.get('market')?.setValue(currentValue === value ? null : value);
  }

  displaySkillName(skill: SkillDto | null): string {
    return skill?.name || '';
  }

  getCategoryMeta(category: SkillCategory): SkillCategoryMeta {
    return SKILL_CATEGORY_META[category];
  }

  getSkillsByCategory(): Array<[SkillCategory, SkillDto[]]> {
    const skills = this.selectedSkills();
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

  updateImageName(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.images.update(imgs => imgs.map((img, i) =>
      i === index ? {...img, metadata: {...img.metadata, name: input.value}} : img
    ));
  }

  updateExistingImageName(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.existingImages.update(imgs => imgs.map((img, i) =>
      i === index ? {...img, metadata: {...img.metadata, name: input.value}} : img
    ));
  }

  private resetForm(): void {
    this.form.reset({
      step1: {
        status: ProjectStatus.IN_PROGRESS,
        visibility: ProjectVisibility.DRAFT,
        companyProject: false
      }
    });
    this.achievements.set([]);
    this.challenges.set([]);
    this.domains.set([]);
    this.teamComposition.set([]);
    this.myRole.set(null);
    this.myRoleControl.reset(null);
    this.images.set([]);
    this.existingImages.set([]);
    this.selectedSkills.set([]);
    this.achievementControl.reset('');
    this.challengeControl.reset('');
    this.domainControl.reset('');
    this.skillSearchControl.reset('');
    this.teamRoleSearchControl.reset('');
    this.step.set(0);
  }
}
