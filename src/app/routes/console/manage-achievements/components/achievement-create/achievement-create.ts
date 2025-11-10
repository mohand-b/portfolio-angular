import {Component, computed, inject, output, signal} from '@angular/core';
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

const ICON_NAMES = [
  'home', 'search', 'explore', 'language', 'menu', 'visibility',
  'star', 'emoji_events', 'workspace_premium', 'military_tech', 'celebration', 'favorite', 'whatshot',
  'person', 'person_add', 'group', 'chat', 'email', 'forum', 'send', 'sms', 'mark_chat_unread', 'mark_email_read', 'chat_bubble', 'chat_bubble_outline',
  'work', 'code', 'terminal', 'lightbulb', 'build', 'rocket_launch', 'bug_report',
  'timeline', 'trending_up', 'insights', 'bar_chart', 'leaderboard', 'auto_graph', 'hourglass_top',
  'travel_explore', 'map', 'pin_drop', 'public', 'flight_takeoff', 'route', 'flag',
  'add', 'check', 'done', 'thumb_up', 'thumb_up_off_alt', 'share', 'ios_share', 'launch', 'download', 'upload', 'bookmark', 'notifications', 'notifications_active',
  'palette', 'brush', 'photo', 'image', 'color_lens', 'style', 'photo_camera',
  'alternate_email', 'link', 'favorite_border', 'campaign', 'group_work', 'volunteer_activism', 'send_time_extension', 'forward_to_inbox',
  'lock', 'verified', 'security', 'key', 'fingerprint',
  'cloud', 'cloud_done', 'cloud_upload', 'cloud_download', 'web', 'dns', 'storage',
  'sports_esports', 'psychology', 'bolt', 'auto_awesome', 'emoji_objects', 'flare',
  'info', 'help', 'book', 'article', 'description', 'library_books', 'school', 'badge', 'bedtime'
];

const DEFAULT_COLOR = '#6b7280';

function iconValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return ICON_NAMES.includes(control.value) ? null : {invalidIcon: true};
}

@Component({
  selector: 'app-achievement-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './achievement-create.html'
})
export class AchievementCreate {
  private readonly consoleFacade = inject(ConsoleFacade);
  private readonly fb = inject(FormBuilder);

  readonly created = output<void>();

  readonly showPanel = signal(false);
  readonly selectedIcon = signal('');

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

  addAchievement(): void {
    if (this.form.invalid) return;

    this.consoleFacade.createAchievement(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({color: DEFAULT_COLOR, isActive: true});
        this.selectedIcon.set('');
        this.created.emit();
      },
      error: () => this.form.markAsTouched()
    });
  }
}
