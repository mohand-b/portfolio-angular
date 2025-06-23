import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {SKILL_CATEGORY_CATALOG, SkillCategory, SkillCreateDto} from '../../../routes/skills/state/skill/skill.model';
import {FormFieldStyleDirective} from '../../../shared/directives/form-field-style.directive';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../routes/console/console.facade';

@Component({
  selector: 'app-skill-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    FormFieldStyleDirective
  ],
  templateUrl: './skill-create.html',
  styleUrl: './skill-create.scss'
})
export class SkillCreate {

  readonly skillCategories: SkillCategory[] = Object.values(SkillCategory) as SkillCategory[];
  protected readonly skillCategoryCatalog = SKILL_CATEGORY_CATALOG;

  private consoleFacade = inject(ConsoleFacade);

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    category: ['', Validators.required],
  });

  addSkill() {
    if (this.form.invalid) return;

    const skill: SkillCreateDto = {
      name: this.form.value.name,
      level: this.form.value.level,
      category: this.form.value.category
    };

    this.consoleFacade.createSkill(skill).subscribe({
      next: () => this.form.reset(),
      error: () => this.form.markAsTouched(),
    });

  }

}
