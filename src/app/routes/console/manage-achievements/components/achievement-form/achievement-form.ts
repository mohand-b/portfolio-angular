import {Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {map, startWith} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ConsoleFacade} from '../../../console.facade';
import {Achievement} from '../../../../../core/state/achievement/achievement.model';
import {ToastService} from '../../../../../shared/services/toast.service';

const ICON_NAMES = ['contact_support', 'auto_stories', 'auto_awesome', 'bedtime', 'bolt', 'book', 'bug_report',
  'celebration', 'chat', 'check', 'code', 'directions_walk', 'emoji_events', 'explore', 'favorite', 'flag', 'group',
  'lightbulb', 'psychology', 'local_fire_department', 'lock', 'military_tech', 'rocket_launch', 'schedule', 'share',
  'smartphone', 'star', 'person_raised_hand', 'terminal', 'thumb_up', 'trending_up', 'verified', 'visibility',
  'workspace_premium'];

const DEFAULT_COLOR = '#6b7280';

function iconValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return ICON_NAMES.includes(control.value) ? null : {invalidIcon: true};
}

@Component({
  selector: 'app-achievement-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './achievement-form.html'
})
export class AchievementForm {
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly achievement = input<Achievement | null>(null);
  readonly saved = output<void>();

  readonly showPanel = signal(false);
  readonly selectedIcon = signal('');
  readonly isEditing = computed(() => !!this.achievement());

  readonly form = this.fb.nonNullable.group({
    icon: ['', [Validators.required, iconValidator]],
    color: [DEFAULT_COLOR, [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    label: ['', [Validators.required]],
    description: [''],
    isActive: [true, [Validators.required]]
  });

  protected readonly iconCtrl = this.form.get('icon') as FormControl<string>;
  protected readonly colorCtrl = this.form.get('color') as FormControl<string>;

  private readonly iconValueChanges = toSignal(
    this.iconCtrl.valueChanges.pipe(
      startWith(''),
      map(v => v.toLowerCase().trim())
    ),
    {initialValue: ''}
  );

  protected readonly filteredIcons = computed(() => {
    const query = this.iconValueChanges();
    return query ? ICON_NAMES.filter(name => name.toLowerCase().includes(query)) : ICON_NAMES;
  });

  constructor() {
    effect(() => {
      const ach = this.achievement();
      if (ach) {
        this.form.patchValue({
          icon: ach.icon,
          color: ach.color,
          code: ach.code,
          label: ach.label,
          description: ach.description || '',
          isActive: ach.isActive
        });
        this.selectedIcon.set(ach.icon);
      } else {
        this.form.reset({color: DEFAULT_COLOR, isActive: true});
        this.selectedIcon.set('');
      }
    });
  }

  selectIcon(iconName: string): void {
    this.iconCtrl.setValue(iconName);
    this.selectedIcon.set(iconName);
    this.showPanel.set(false);
  }

  clearIcon(): void {
    this.iconCtrl.setValue('');
    this.selectedIcon.set('');
    this.showPanel.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.showPanel.set(false), 200);
  }

  onCodeInput(): void {
    const codeCtrl = this.form.get('code');
    if (!codeCtrl) return;
    const value = codeCtrl.value.toUpperCase().slice(0, 5);
    if (value !== codeCtrl.value) {
      codeCtrl.setValue(value, {emitEvent: false});
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const operation$ = this.isEditing()
      ? this.consoleFacade.updateAchievement(this.achievement()!.code, formValue)
      : this.consoleFacade.createAchievement(formValue);

    operation$.subscribe({
      next: () => {
        const message = this.isEditing() ? 'Succès modifié avec succès' : 'Succès créé avec succès';
        this.toastService.success(message);
        if (!this.isEditing()) {
          this.form.reset({color: DEFAULT_COLOR, isActive: true});
          this.selectedIcon.set('');
        }
        this.saved.emit();
      },
      error: () => {
        const message = this.isEditing()
          ? 'Erreur lors de la modification du succès'
          : 'Erreur lors de la création du succès';
        this.toastService.error(message);
        this.form.markAsTouched();
      }
    });
  }
}
