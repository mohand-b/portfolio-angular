import {Component, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {AlertMessage} from '../../../../shared/components/alert-message/alert-message';
import {CoreFacade} from '../../../../core/core.facade';
import {ToastService} from '../../../../shared/services/toast.service';
import {MatIconModule} from '@angular/material/icon';

export interface EmailEditModalData {
  currentEmail: string;
}

@Component({
  selector: 'app-email-edit-modal',
  imports: [MatDialogModule, MatButtonModule, FormsModule, AlertMessage, MatIconModule],
  templateUrl: './email-edit-modal.html'
})
export class EmailEditModal {
  readonly data = inject<EmailEditModalData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EmailEditModal>);
  private readonly coreFacade = inject(CoreFacade);
  private readonly toastService = inject(ToastService);

  email = this.data.currentEmail;
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  confirm() {
    if (!this.email || this.email === this.data.currentEmail) {
      this.dialogRef.close(null);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.coreFacade.updateVisitorEmail(this.email).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.dialogRef.close(true);
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.message || 'Une erreur est survenue';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
