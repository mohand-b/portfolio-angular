import {Component, inject, output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-project-timeline-item-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonToggleModule
  ],
  templateUrl: './project-timeline-item-create.html',
  styleUrl: './project-timeline-item-create.scss'
})
export class ProjectTimelineItemCreate {

  readonly step = signal(1);
  readonly stepsMeta = [
    {icon: 'description', label: 'Étape 1 : Contexte'},
    {icon: 'build', label: 'Étape 2 : Typologie & stack'},
    {icon: 'format_list_bulleted', label: 'Étape 3 : Missions'},
    {icon: 'photo_library', label: 'Étape 4 : Médias & impact'},
  ] as const;

  readonly projectTypeOptions = [
    'MVP / POC',
    'SaaS',
    'SPA',
    'Back-office / Admin UI',
    'Mobile-like',
    'Data-driven',
  ] as const;

  readonly scopeOptions = ['Interne', 'Externe'] as const;
  readonly marketOptions = ['B2B', 'B2C'] as const;
  missions: WritableSignal<string[]> = signal([]);
  submitted = output<void>();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private fb = inject(FormBuilder);
  missionControl = this.fb.control('');
  readonly eventForm = this.fb.group({
    step1: this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      context: [''],
      collaboration: [''],
    }),
    step2: this.fb.group({
      projectType: this.fb.control<string[]>([], {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      scope: this.fb.control<string | null>(null, {validators: [Validators.required]}),
      market: this.fb.control<string | null>(null, {validators: [Validators.required]}),
      tools: this.fb.control<string[]>([], {validators: [Validators.minLength(1)]}),
    }),
    step4: this.fb.group({}),
  })

  get s1(): FormGroup {
    return this.getStepGroup(0)!;
  }

  get s2(): FormGroup {
    return this.getStepGroup(1)!;
  }

  get s4(): FormGroup {
    return this.getStepGroup(3)!;
  }

  get toolsCtrl(): FormControl<string[]> {
    return this.eventForm.get('step2.tools') as FormControl<string[]>;
  }

  keywords() {
    return this.toolsCtrl.value ?? [];
  }

  next() {
    const idx = this.step();
    const current = this.getStepGroup(idx);
    if (current && current.invalid) {
      current.markAllAsTouched();
      return;
    }
    if (idx < this.stepsMeta.length - 1) {
      this.step.update(v => v + 1);
    }
  }

  //

  prev() {
    if (this.step() > 0) this.step.update(v => v - 1);
  }

  onSubmit() {
  }

  add(event: MatChipInputEvent) {
    const value = (event.value ?? '').trim();
    if (!value) return;

    const current = this.keywords();
    if (!current.some(k => k.toLowerCase() === value.toLowerCase())) {
      this.toolsCtrl.setValue([...current, value]);
      this.toolsCtrl.markAsDirty();
      this.toolsCtrl.updateValueAndValidity();
    }

    event.chipInput?.clear();
  }

  removeKeyword(keyword: string) {
    this.toolsCtrl.setValue(this.keywords().filter(k => k !== keyword));
    this.toolsCtrl.markAsDirty();
    this.toolsCtrl.updateValueAndValidity();
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

  private getStepGroup(idx: number): FormGroup | null {
    return this.eventForm.get(`step${idx + 1}`) as FormGroup | null;
  }


}
