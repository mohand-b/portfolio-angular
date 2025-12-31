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
import {toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, of, switchMap} from 'rxjs';
import {environment} from '../../../../../../../environments/environments';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {ToastService} from '../../../../../shared/services/toast.service';
import {StepConfig, Stepper} from '../../../../../shared/components/stepper/stepper';
import {JobMinimalDto} from '../../../../career/state/job/job.model';
import {PROJECT_TYPE_OPTIONS, ProjectDto} from '../../../../projects/state/project/project.model';
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
  readonly missions = signal<string[]>([]);
  readonly images = signal<Array<{ file: File; preview: string }>>([]);
  readonly existingImages = signal<string[]>([]);
  readonly selectedSkills = signal<SkillDto[]>([]);
  readonly isEditing = computed(() => !!this.project());

  private readonly jobsResource = httpResource<JobMinimalDto[]>(() => ({
    url: `${environment.baseUrl}/jobs/minimal`,
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
  }));

  readonly jobs = computed(() => this.jobsResource.value() ?? []);

  readonly missionControl = this.fb.control('');
  readonly skillSearchControl = this.fb.control('');

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

  readonly form = this.fb.group({
    step1: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      collaboration: [''],
      isCompanyProject: [false],
      jobId: [null as string | null],
    }),
    step2: this.fb.group({
      projectTypes: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
      scope: this.fb.control<string | null>(null),
      market: this.fb.control<string | null>(null),
    }),
    step3: this.fb.group({}),
    step4: this.fb.group({}),
  });

  readonly stepsMeta: StepConfig[] = [
    {icon: 'description', text: 'Infos'},
    {icon: 'build', text: 'Détails'},
    {icon: 'format_list_bulleted', text: 'Missions'},
    {icon: 'photo_library', text: 'Images'}
  ];
  readonly projectTypeOptions = PROJECT_TYPE_OPTIONS;

  get s1(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }

  get s2(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }

  constructor() {
    effect(() => {
      const proj = this.project();
      if (proj) {
        this.s1.patchValue({
          title: proj.title,
          description: proj.description || '',
          collaboration: proj.collaboration || '',
          isCompanyProject: !!proj.job,
          jobId: proj.job?.id || null
        });
        this.s2.patchValue({
          projectTypes: proj.projectTypes,
          scope: proj.scope,
          market: proj.market
        });
        this.missions.set(proj.missions || []);
        this.selectedSkills.set(proj.skills || []);
        this.images.set([]);
        this.existingImages.set(proj.images || []);
      } else {
        this.resetForm();
      }
    });
    effect(() => {
      if (!this.s1.get('isCompanyProject')?.value) {
        this.s1.get('jobId')?.setValue(null);
      }
    });
  }

  next(): void {
    const current = this.form.get(`step${this.step() + 1}`) as FormGroup | null;
    if (current?.invalid) {
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
      this.s1.markAllAsTouched();
      this.s2.markAllAsTouched();
      this.step.set(this.s1.invalid ? 0 : this.s2.invalid ? 1 : 0);
      return;
    }

    const {step1, step2} = this.form.getRawValue();
    const payload: any = {
      title: step1.title!.trim(),
      jobId: step1.isCompanyProject && step1.jobId ? step1.jobId : undefined,
      description: step1.description?.trim() || '',
      collaboration: step1.collaboration?.trim() || '',
      missions: this.missions(),
      projectTypes: step2.projectTypes!,
      skillIds: this.selectedSkills().map(skill => skill.id),
    };

    if (step2.scope) {
      payload.scope = step2.scope;
    } else if (this.isEditing()) {
      payload.scope = '';
    }

    if (step2.market) {
      payload.market = step2.market;
    } else if (this.isEditing()) {
      payload.market = '';
    }

    const formData = toFormData(payload);

    if (this.isEditing()) {
      if (this.existingImages().length === 0 && this.images().length === 0) {
        formData.append('removeAllImages', 'true');
      } else {
        this.existingImages().forEach(url => {
          formData.append('images', url);
        });
      }
    }

    this.images().forEach(img => {
      formData.append('images', img.file);
    });


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
        this.s1.markAllAsTouched();
        this.s2.markAllAsTouched();
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

  addMission(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const value = (this.missionControl.value ?? '').trim();
    if (!value) return;
    this.missions.update(arr => [...arr, value]);
    this.missionControl.reset('');
  }

  removeMission(index: number): void {
    this.missions.update(arr => arr.filter((_, i) => i !== index));
  }

  onFilesSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const availableSlots = 4 - this.totalImages;
    if (availableSlots <= 0) {
      alert('Maximum 4 images autorisées');
      return;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    files.slice(0, availableSlots).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Type non autorisé: ${file.name}. Formats acceptés: PNG, JPEG, WEBP`);
        return;
      }
      if (file.size > maxSize) {
        alert(`Fichier trop volumineux: ${file.name}. Max 5MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.images.update(imgs => [...imgs, {file, preview: reader.result as string}]);
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

  get totalImages(): number {
    return this.images().length + this.existingImages().length;
  }

  setScope(value: string): void {
    const currentValue = this.s2.get('scope')?.value;
    this.s2.get('scope')?.setValue(currentValue === value ? null : value);
  }

  setMarket(value: string): void {
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

  private resetForm(): void {
    this.form.reset();
    this.missions.set([]);
    this.images.set([]);
    this.existingImages.set([]);
    this.selectedSkills.set([]);
    this.missionControl.reset('');
    this.skillSearchControl.reset('');
    this.step.set(0);
  }
}
