import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {
  SKILL_CATEGORY_META,
  SKILL_KIND_META,
  SkillCategory,
  SkillCreateDto,
  SkillDto,
  SkillKind
} from '../../../../skills/state/skill/skill.model';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-skill-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.scss'
})
export class SkillForm {
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly skill = input<SkillDto | null>(null);
  readonly saved = output<void>();

  readonly isEditing = computed(() => !!this.skill());

  readonly skillCategories: SkillCategory[] = Object.values(SkillCategory) as SkillCategory[];
  readonly skillKinds = Object.values(SkillKind);
  readonly currentYear = new Date().getFullYear();
  readonly minYear = 2015;
  readonly maxYear = this.currentYear;

  readonly priorityLevels = [
    {value: 0, label: 'Mineure', icon: 'remove', color: '#94A3B8'},
    {value: 1, label: 'Normale', icon: 'check', color: '#22C55E'},
    {value: 2, label: 'Importante', icon: 'priority_high', color: '#F59E0B'},
    {value: 3, label: 'Essentielle', icon: 'local_fire_department', color: '#EF4444'},
  ];

  readonly svgFile = signal<{ file: File; preview: string } | null>(null);
  readonly existingSvg = signal<string | null>(null);
  readonly existingSvgSafe = computed<SafeHtml | null>(() => {
    const svg = this.existingSvg();
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  });

  protected readonly skillCategoryCatalog = SKILL_CATEGORY_META;
  protected readonly skillKindCatalog = SKILL_KIND_META;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    level: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    categories: [[], Validators.required],
    kind: ['', Validators.required],
    sinceYear: [null],
    displayPriority: [1, Validators.required],
  });

  constructor() {
    effect(() => {
      const skill = this.skill();
      if (skill) {
        this.form.patchValue({
          name: skill.name,
          level: skill.level,
          categories: skill.categories,
          kind: skill.kind,
          sinceYear: skill.sinceYear || null,
          displayPriority: skill.displayPriority,
        });

        if (skill.iconSvg) {
          this.existingSvg.set(skill.iconSvg);
        }
        this.svgFile.set(null);
      } else {
        this.form.reset({
          name: '',
          level: 3,
          categories: [],
          kind: '',
          sinceYear: null,
          displayPriority: 1
        });
        this.svgFile.set(null);
        this.existingSvg.set(null);
      }
    });
  }

  onSvgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.includes('svg')) {
      alert('Seuls les fichiers SVG sont autorisés');
      input.value = '';
      return;
    }

    if (file.size > 100 * 1024) {
      alert('Le fichier SVG est trop volumineux (max 100KB)');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const svgContent = reader.result as string;
      const preview = `data:image/svg+xml;base64,${btoa(svgContent)}`;
      this.svgFile.set({file, preview});
      this.existingSvg.set(null);
    };
    reader.readAsText(file);

    input.value = '';
  }

  clearSvg(): void {
    this.svgFile.set(null);
    this.existingSvg.set(null);
  }

  getSelectedCategoriesLabel(): string {
    const categories = this.form.value.categories as SkillCategory[];
    if (!categories || categories.length === 0) return '';
    return categories.map(cat => this.skillCategoryCatalog[cat].shortLabel).join(', ');
  }

  save() {
    if (this.form.invalid) return;

    const svgData = this.svgFile();
    let svgContent: string | undefined;

    if (svgData) {
      const base64Data = svgData.preview.split(',')[1];
      svgContent = atob(base64Data);
    } else if (this.existingSvg()) {
      svgContent = this.existingSvg()!;
    }

    const skillData: SkillCreateDto = {
      name: this.form.value.name,
      level: this.form.value.level,
      kind: this.form.value.kind,
      categories: this.form.value.categories,
      displayPriority: this.form.value.displayPriority,
      sinceYear: this.form.value.sinceYear || undefined,
      iconSvg: svgContent,
    };

    const operation = this.isEditing()
      ? this.consoleFacade.updateSkill(this.skill()!.id, skillData)
      : this.consoleFacade.createSkill(skillData);

    operation.subscribe({
      next: () => {
        this.saved.emit();
        if (!this.isEditing()) {
          this.form.reset({level: 3, displayPriority: 1});
          this.clearSvg();
        }
      },
      error: () => this.form.markAsTouched(),
    });
  }
}
