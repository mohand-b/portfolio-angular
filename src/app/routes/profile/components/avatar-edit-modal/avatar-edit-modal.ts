import {Component, computed, inject, signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {SvgSafePipe} from '../../../../shared/pipes/svg-safe.pipe';
import {CoreFacade} from '../../../../core/core.facade';
import {ToastService} from '../../../../shared/services/toast.service';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {AvatarGeneratorService} from '../../services/avatar-generator';

const AVATAR_COUNT = 5;
const GENERATION_DELAY = 50;
const ANIMATION_DURATION = 900;

@Component({
  selector: 'app-avatar-edit-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, SvgSafePipe, AlertMessage],
  templateUrl: './avatar-edit-modal.html',
  animations: [
    trigger('avatarList', [
      transition('* => *', [
        query(':enter', [
          style({opacity: 0, transform: 'rotate(0deg) scale(0.3)', filter: 'blur(10px)'}),
          stagger(80, [
            animate('800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              style({opacity: 1, transform: 'rotate(1080deg) scale(1)', filter: 'blur(0px)'})
            )
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class AvatarEditModal {
  private readonly dialogRef = inject(MatDialogRef<AvatarEditModal>);
  private readonly coreFacade = inject(CoreFacade);
  private readonly toastService = inject(ToastService);
  private readonly avatarGenerator = inject(AvatarGeneratorService);

  readonly isLoading = signal(false);
  readonly isGenerating = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly avatars = signal<string[]>([]);
  readonly selectedAvatar = signal<string | null>(null);
  readonly generationTrigger = signal(0);

  readonly canConfirm = computed(() => !this.isLoading() && !!this.selectedAvatar());

  constructor() {
    this.generateAvatars();
  }

  generateAvatars(): void {
    this.isGenerating.set(true);
    this.selectedAvatar.set(null);

    setTimeout(() => {
      this.avatars.set(this.avatarGenerator.generateBatch(AVATAR_COUNT));
      this.generationTrigger.update(n => n + 1);

      setTimeout(() => this.isGenerating.set(false), ANIMATION_DURATION);
    }, GENERATION_DELAY);
  }

  selectAvatar(avatar: string): void {
    if (!this.isGenerating()) {
      this.selectedAvatar.set(avatar);
    }
  }

  confirm(): void {
    const selected = this.selectedAvatar();
    if (!selected) {
      this.errorMessage.set('Veuillez sélectionner un avatar');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.coreFacade.updateVisitorAvatar(selected).subscribe({
      next: (response) => {
        this.toastService.success(response.message || 'Avatar mis à jour avec succès');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || err?.message || 'Une erreur est survenue');
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
