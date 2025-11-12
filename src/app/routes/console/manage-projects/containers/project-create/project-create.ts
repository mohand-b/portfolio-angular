import {Component, inject, OnInit, output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {debounceTime, distinctUntilChanged, switchMap, of} from 'rxjs';
import {ConsoleFacade} from '../../../console.facade';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {StepConfig, Stepper} from '../../../../../shared/components/stepper/stepper';
import {SkillService} from '../../../../skills/state/skill/skill.service';
import {SkillDto, SkillCategory, SKILL_CATEGORY_META, SkillCategoryMeta} from '../../../../skills/state/skill/skill.model';
import {JobService} from '../../../../career/state/job/job.service';
import {JobMinimalDto} from '../../../../career/state/job/job.model';

@Component({
  selector: 'app-project-create',
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
  templateUrl: './project-create.html',
  styleUrl: './project-create.scss'
})
export class ProjectCreate implements OnInit {
  private fb = inject(FormBuilder);
  private skillService = inject(SkillService);
  private jobService = inject(JobService);
  private consoleFacade = inject(ConsoleFacade);

  readonly step = signal(0);
  readonly isSubmitting = signal(false);
  readonly created = output<void>();
  readonly jobs = signal<JobMinimalDto[]>([]);

  readonly stepsMeta: StepConfig[] = [
    {icon: 'description', text: 'Infos'},
    {icon: 'build', text: 'Détails'},
    {icon: 'format_list_bulleted', text: 'Missions'},
    {icon: 'photo_library', text: 'Images'},
  ];

  readonly projectTypeOptions = [
    'MVP / POC',
    'SaaS',
    'SPA',
    'Back-office / Admin UI',
    'Mobile-like',
    'Data-driven',
  ] as const;

  readonly missions: WritableSignal<string[]> = signal([]);
  readonly images = signal<Array<{ file: File; preview: string }>>([]);
  readonly selectedSkills: WritableSignal<SkillDto[]> = signal([]);
  readonly filteredSkills = signal<SkillDto[]>([]);

  readonly missionControl = this.fb.control('');
  readonly skillSearchControl = this.fb.control('');

  readonly eventForm = this.fb.group({
    step1: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      collaboration: [''],
      isCompanyProject: [false],
      jobId: [null as string | null],
    }),
    step2: this.fb.group({
      projectTypes: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)]),
      scope: this.fb.control<string | null>(null, [Validators.required]),
      market: this.fb.control<string | null>(null, [Validators.required]),
    }),
    step3: this.fb.group({}),
    step4: this.fb.group({}),
  });

  get s1(): FormGroup {
    return this.getStepGroup(0)!;
  }

  get s2(): FormGroup {
    return this.getStepGroup(1)!;
  }

  get s3(): FormGroup {
    return this.getStepGroup(2)!;
  }

  get s4(): FormGroup {
    return this.getStepGroup(3)!;
  }

  ngOnInit() {
    this.jobService.getJobsMinimal().subscribe(jobs => {
      this.jobs.set(jobs);
    });

    this.s1.get('isCompanyProject')?.valueChanges.subscribe(isCompanyProject => {
      if (!isCompanyProject) {
        this.s1.get('jobId')?.setValue(null);
      }
    });

    this.skillSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (typeof query !== 'string' || !query || query.trim().length < 2) {
          return of([]);
        }
        return this.skillService.searchSkills(query.trim(), 5);
      })
    ).subscribe(skills => {
      this.filteredSkills.set(skills);
    });
  }

  displaySkillName(skill: SkillDto | null): string {
    return skill ? skill.name : '';
  }

  getCategoryMeta(category: SkillCategory): SkillCategoryMeta {
    return SKILL_CATEGORY_META[category];
  }

  getSkillsByCategory() {
    const skills = this.selectedSkills();
    const grouped = new Map<SkillCategory, SkillDto[]>();

    skills.forEach(skill => {
      if (!grouped.has(skill.category)) {
        grouped.set(skill.category, []);
      }
      grouped.get(skill.category)!.push(skill);
    });

    const categoryOrder = Object.values(SkillCategory);
    return Array.from(grouped.entries()).sort((a, b) => {
      return categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0]);
    });
  }

  next() {
    const idx = this.step();
    const current = this.getStepGroup(idx);
    if (current?.invalid) {
      current.markAllAsTouched();
      return;
    }
    if (idx < this.stepsMeta.length - 1) {
      this.step.update(v => v + 1);
    }
  }

  prev() {
    if (this.step() > 0) {
      this.step.update(v => v - 1);
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.s1.markAllAsTouched();
      this.s2.markAllAsTouched();

      this.step.set(this.s1.invalid ? 0 : this.s2.invalid ? 1 : 0);
      return;
    }

    const {step1, step2} = this.eventForm.getRawValue();
    const imageFiles = this.images().map(img => img.file);
    const skillIds = this.selectedSkills().map(skill => skill.id);

    const payload = {
      title: step1.title!.trim(),
      jobId: step1.isCompanyProject && step1.jobId ? step1.jobId : undefined,
      description: step1.description?.trim() || undefined,
      collaboration: step1.collaboration?.trim() || undefined,
      missions: this.missions(),
      projectTypes: step2.projectTypes!,
      scope: step2.scope!,
      market: step2.market!,
      skillIds: skillIds,
    };

    const formData = toFormData(payload);

    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    this.isSubmitting.set(true);
    this.consoleFacade.addProject(formData).subscribe({
      next: () => {
        this.created.emit();
        this.eventForm.reset();
        this.missions.set([]);
        this.images.set([]);
        this.selectedSkills.set([]);
        this.missionControl.reset('');
        this.skillSearchControl.reset('');
        this.step.set(0);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.s1.markAllAsTouched();
        this.s2.markAllAsTouched();
        this.isSubmitting.set(false);
      },
    });
  }

  onSkillSelected(event: MatAutocompleteSelectedEvent) {
    const skill: SkillDto = event.option.value;
    const current = this.selectedSkills();
    if (!current.some(s => s.id === skill.id)) {
      this.selectedSkills.set([...current, skill]);
    }
    this.skillSearchControl.setValue('');
    this.filteredSkills.set([]);
  }

  removeSkill(skill: SkillDto) {
    this.selectedSkills.set(this.selectedSkills().filter(s => s.id !== skill.id));
  }

  addMission(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const v = (this.missionControl.value ?? '').trim();
    if (!v) return;
    this.missions.update(arr => [...arr, v]);
    this.missionControl.reset('');
  }

  removeMission(i: number) {
    this.missions.update(arr => arr.filter((_, idx) => idx !== i));
  }

  onFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;

    const MAX_IMAGES = 4;
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const availableSlots = MAX_IMAGES - this.images().length;

    if (availableSlots <= 0) {
      alert(`Maximum ${MAX_IMAGES} images autorisées`);
      return;
    }

    files.slice(0, availableSlots).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Type non autorisé: ${file.name}. Formats acceptés: PNG, JPEG, WEBP`);
        return;
      }
      if (file.size > MAX_SIZE) {
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

  removeImage(index: number) {
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
  }

  setScope(value: string) {
    this.s2.get('scope')?.setValue(value);
  }

  setMarket(value: string) {
    this.s2.get('market')?.setValue(value);
  }

  private getStepGroup(idx: number): FormGroup | null {
    return this.eventForm.get(`step${idx + 1}`) as FormGroup | null;
  }
}
