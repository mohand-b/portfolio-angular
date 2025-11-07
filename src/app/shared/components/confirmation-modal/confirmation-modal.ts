import {Component, computed, input, output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-modal',
  imports: [MatIconModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {
  readonly isOpen = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly isDelete = input<boolean>(false);
  readonly icon = input<string>();
  readonly confirmLabel = input<string>('Confirmer');
  readonly cancelLabel = input<string>('Annuler');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly displayIcon = computed(() => this.icon() || (this.isDelete() ? 'delete' : 'check'));

  readonly confirmButtonClass = computed(() =>
    `flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer ${
      this.isDelete() ? 'bg-red-700' : 'bg-primary'
    }`
  );

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
