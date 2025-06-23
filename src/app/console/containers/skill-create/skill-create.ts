import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {SKILL_CATEGORY_CATALOG, SkillCategory} from '../../../routes/skills/state/skill.model';
import {FormFieldStyleDirective} from '../../../shared/directives/form-field-style.directive';

@Component({
  selector: 'app-skill-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormFieldStyleDirective
  ],
  templateUrl: './skill-create.html',
  styleUrl: './skill-create.scss'
})
export class SkillCreate {

  readonly skillCategories: SkillCategory[] = Object.values(SkillCategory) as SkillCategory[];
  readonly skillCategoryCatalog = SKILL_CATEGORY_CATALOG;

  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    category: ['', Validators.required],
  });

  addSkill() {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }

}
